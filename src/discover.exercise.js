/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import './bootstrap'
import Tooltip from '@reach/tooltip'
import {FaSearch} from 'react-icons/fa'
import {Input, BookListUL, Spinner} from './components/lib'
import {BookRow} from './components/book-row'

function DiscoverBooksScreen() {
  const [queried, setQueried] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState('idle')
  const [data, setData] = React.useState(null)

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'

  React.useEffect(() => {
    if (!queried) return
    setStatus('loading')
    window
      .fetch(
        `${process.env.REACT_APP_API_URL}/books?query=${encodeURIComponent(
          query,
        )}`,
      )
      .then(response => response.json())
      .then(responseData => {
        setData(responseData)
        setStatus('success')
      })
  }, [queried, query])

  function handleSearchSubmit(event) {
    event.preventDefault()
    const query = event.target.elements.search.value
    setQuery(query)
    setQueried(true)
  }

  return (
    <div
      css={{maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0'}}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isLoading ? <Spinner /> : <FaSearch aria-label="search" />}
            </button>
          </label>
        </Tooltip>
      </form>

      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  )
}

export {DiscoverBooksScreen}
