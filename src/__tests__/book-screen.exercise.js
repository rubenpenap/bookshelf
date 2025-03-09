import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {queryCache} from 'react-query'
import {buildUser, buildBook} from 'test/generate'
import * as auth from 'auth-provider'
import {AppProviders} from 'context'
import {App} from 'app'

afterEach(() => {
  queryCache.clear()
  auth.logout()
})

test('renders all the book information', async () => {
  const user = buildUser()
  const book = buildBook()
  window.localStorage.setItem(auth.localStorageKey, 'SOME_FAKE_TOKEN')
  window.history.pushState({}, 'Test page', `/book/${book.id}`)
  const originalFetch = window.fetch
  window.fetch = async (url, config) => {
    if (url.endsWith('/bootstrap')) {
      return {
        ok: true,
        json: async () => ({
          user: {...user, token: 'SOME_FAKE_TOKEN'},
          listItems: [],
        }),
      }
    } else if (url.endsWith(`/books/${book.id}`)) {
      return {
        ok: true,
        json: async () => ({book}),
      }
    }
    console.log(url, config)
    return originalFetch(url, config)
  }
  render(<App />, {wrapper: AppProviders})
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  await waitForElementToBeRemoved(() =>
    screen.getByRole('heading', {name: /loading/i}),
  )
  expect(screen.getByRole('heading', {name: book.title})).toBeInTheDocument()
  expect(screen.getByText(book.author)).toBeInTheDocument()
  expect(screen.getByText(book.publisher)).toBeInTheDocument()
  expect(screen.getByText(book.synopsis)).toBeInTheDocument()
  expect(screen.getByRole('img', {name: /book cover/i})).toBeInTheDocument()
  expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /remove from list/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as read/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as unread/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('textarea', {name: /notes/i}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
  // screen.debug()
})
