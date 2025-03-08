import {server, rest} from 'test/server'
import {client} from 'utils/api-client'

const apiURL = process.env.REACT_APP_API_URL
const endpoint = 'test-endpoint'
const mockResult = {mockValue: 'VALUE'}

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )
  const result = await client(endpoint)
  expect(result).toEqual(mockResult)
})

test('adds auth token when a token is provided', async () => {
  const token = 'FAKE_TOKEN'
  let request
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    }),
  )
  await client(endpoint, {token})
  expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`)
})

test('allows for config overrides', async () => {
  const mode = 'cors'
  const customConfig = {mode: mode}
  let request
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    }),
  )
  await client(endpoint, customConfig)
  expect(request.mode).toBe(mode)
})

test('when data is provided, it is stringified and the method defaults to POST', async () => {
  const data = {a: 'b'}
  server.use(
    rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(req.body))
    }),
  )
  const result = await client(endpoint, {data})
  expect(result).toEqual(data)
})
