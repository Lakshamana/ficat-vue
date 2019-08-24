/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')

const { knex } = require('../../server/db')
const { createSeeds, wipeTable } = require('../utils')
const server = require('../../server')
const HttpCodes = require('../../server/httpCodes')

chai.use(chaiHttp)
jest.useFakeTimers()
jest.setTimeout(10000)

// Suíte de testes da entidade users
describe('prefix /api/users', () => {
  beforeAll(async () => {
    await knex.migrate.latest()
  }, 100000)

  beforeEach(async () => {
    await createSeeds('users')
  }, 100000)

  afterEach(async () => {
    await wipeTable('users')
  }, 100000)

  test('GET /', async done => {
    const response = await chai.request(server.listen()).get('/api/users')
    expect(response.status).toBe(HttpCodes.OK.code)
    expect(response.type).toBe('application/json')
    expect(response.body).toBeDefined()
    done()
  })

  test('GET /', async done => {
    const response = await chai.request(server.listen()).get('/api/users')
    expect(response.status).toBe(HttpCodes.OK.code)
    expect(response.type).toBe('application/json')
    expect(response.body).toBeDefined()
    done()
  })
})
