import {renderHook, act} from '@testing-library/react'
import {useAsync} from '../hooks'

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
// 💰 useAsync(customInitialState)

test('can set the data', async () => {})
// 💰 result.current.setData('whatever you want')

test('can set the error', async () => {})
// 💰 result.current.setError('whatever you want')

test('No state updates happen if the component is unmounted while pending', async () => {})
// 💰 const {result, unmount} = renderHook(...)
// 🐨 ensure that console.error is not called (React will call console.error if updates happen when unmounted)

test('calling "run" without a promise results in an early error', async () => {})
