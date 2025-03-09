import {renderHook, act} from '@testing-library/react'
import {useAsync} from '../hooks'

beforeEach(() => jest.spyOn(console, 'error'))
afterEach(() => console.error.mockRestore())

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

const initialState = {
  status: 'idle',
  data: null,
  error: null,

  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,

  run: expect.any(Function),
  reset: expect.any(Function),
  setData: expect.any(Function),
  setError: expect.any(Function),
}

test('calling run with a promise which resolves', async () => {
  const {promise, resolve} = deferred()
  const {result} = renderHook(() => useAsync())

  expect(result.current).toEqual(initialState)
  let p
  act(() => {
    p = result.current.run(promise)
  })
  expect(result.current).toEqual({
    ...initialState,
    status: 'pending',
    isIdle: false,
    isLoading: true,
  })
  const resolvedValue = Symbol('Resolved Value')
  await act(async () => {
    resolve(resolvedValue)
    await p
  })
  expect(result.current).toEqual({
    ...initialState,
    status: 'resolved',
    data: resolvedValue,
    isIdle: false,
    isSuccess: true,
  })
  act(() => {
    result.current.reset()
  })
  expect(result.current).toEqual(initialState)
})

test('calling run with a promise which rejects', async () => {
  const {promise, reject} = deferred()
  const {result} = renderHook(() => useAsync())

  let p
  act(() => {
    p = result.current.run(promise)
  })
  const rejectedValue = Symbol('Rejected Value')
  await act(async () => {
    reject(rejectedValue)
    await p.catch(() => {
      // ignore error
    })
  })
  expect(result.current).toEqual({
    ...initialState,
    status: 'rejected',
    error: rejectedValue,
    isIdle: false,
    isError: true,
  })
})

test('can specify an initial state', async () => {
  const mockData = Symbol('Resolved Data')
  const customInitialState = {
    status: 'resolved',
    data: mockData,
  }
  const {result} = renderHook(() => useAsync(customInitialState))

  expect(result.current).toEqual({
    ...initialState,
    ...customInitialState,
    isIdle: false,
    isSuccess: true,
  })
})

test('can set the data', async () => {
  const mockData = Symbol('Resolved Data')
  const {result} = renderHook(() => useAsync())

  act(() => {
    result.current.setData(mockData)
  })
  expect(result.current).toEqual({
    ...initialState,
    status: 'resolved',
    data: mockData,
    isIdle: false,
    isSuccess: true,
  })
})

test('can set the error', async () => {
  const mockError = Symbol('Rejected Value')
  const {result} = renderHook(() => useAsync())

  act(() => {
    result.current.setError(mockError)
  })
  expect(result.current).toEqual({
    ...initialState,
    status: 'rejected',
    error: mockError,
    isIdle: false,
    isError: true,
  })
})

test('No state updates happen if the component is unmounted while pending', async () => {
  const {promise, resolve} = deferred()
  const {result, unmount} = renderHook(() => useAsync())
  let p
  act(() => {
    p = result.current.run(promise)
  })
  unmount()
  await act(async () => {
    resolve()
    await p
  })
  expect(console.error).not.toHaveBeenCalled()
})

test('calling "run" without a promise results in an early error', async () => {
  const {result} = renderHook(() => useAsync())
  expect(() => result.current.run()).toThrowErrorMatchingInlineSnapshot(
    `"The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"`,
  )
})
