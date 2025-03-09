import * as React from 'react'
import {
  render,
  screen /* , act */ /* , waitFor */,
} from '@testing-library/react'
import {queryCache} from 'react-query'
// import {buildUser, buildBook} from 'test/generate'
import * as auth from 'auth-provider'
import {AppProviders} from 'context'
import {App} from 'app'

afterEach(() => {
  queryCache.clear()
  auth.logout()
})

test('renders all the book information', async () => {
  render(<App />, {wrapper: AppProviders})
  screen.debug()
})
