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

  test('List all users', async done => {
    const response = await chai.request(server.listen()).get('/api/users')
    expect(response.status).toBe(HttpCodes.OK)
    expect(response.type).toBe('application/json')
    expect(response.body).toBeDefined()
    done()
  })

  test('Create new user', async done => {
    const payload = {
      username: 'person',
      password: 'person',
      active: true
    }
    const response = await chai
      .request(server.listen())
      .post('/api/users')
      .send(payload)
    expect(response.status).toBe(HttpCodes.OK)
    expect(response.type).toBe('application/json')
    expect(response.body).toBeDefined()
    expect(response.body.id).toBeDefined()
    expect(response.body.username).toBe(payload.username)
    expect(response.body.active).toBe(payload.active)
    expect(response.body.password).toBe(undefined)
    done()
  })

  test('Create new user fields written wrong', async done => {
    const payload = {
      username: 'person',
      passwd: 'fancy-password', // Should be password
      active: false
    }
    const response = await chai
      .request(server.listen())
      .post('/api/users')
      .send(payload)
    expect(response.status).toBe(HttpCodes.BAD_REQUEST)
    expect(response.type).toBe('application/json')
    expect(response.body).toStrictEqual({
      message: 'errOnPayloadValidation',
      errors: [
        {
          errCode: 'missingFields',
          fields: 'password'
        },
        {
          errCode: 'invalidFields',
          fields: 'passwd'
        }
      ]
    })
    done()
  })

  test('Create new user missing fields', async done => {
    // Should have `username` property
    const payload = {
      active: true,
      password: 'fancy-password'
    }
    const response = await chai
      .request(server.listen())
      .post('/api/users')
      .send(payload)
    expect(response.status).toBe(HttpCodes.BAD_REQUEST)
    expect(response.type).toBe('application/json')
    expect(response.body).toStrictEqual({
      message: 'errOnPayloadValidation',
      errors: [
        {
          errCode: 'missingFields',
          fields: 'username'
        }
      ]
    })
    done()
  })

  test('Create new user invalid fields', async done => {
    const payload = {
      username: 'Guilherme',
      active: true,
      password: 'fancy-password',
      invalidField: 'invalidValue'
    }
    const response = await chai
      .request(server.listen())
      .post('/api/users')
      .send(payload)
    expect(response.status).toBe(HttpCodes.BAD_REQUEST)
    expect(response.type).toBe('application/json')
    expect(response.body).toStrictEqual({
      message: 'errOnPayloadValidation',
      errors: [
        {
          errCode: 'invalidFields',
          fields: 'invalidField'
        }
      ]
    })
    done()
  })

  test('Try to create existing user', async done => {
    const firstUser = {
      username: 'Guilherme',
      active: true,
      password: 'fancy-password'
    }

    const userCreationToFail = {
      username: 'Guilherme',
      active: true,
      password: 'another-password'
    }

    // Creating first user
    await chai
      .request(server.listen())
      .post('/api/users')
      .send(firstUser)

    // Try to create another one with same username
    const response = await chai
      .request(server.listen())
      .post('/api/users')
      .send(userCreationToFail)
    expect(response.status).toBe(HttpCodes.BAD_REQUEST)
    expect(response.type).toBe('application/json')
    expect(response.body).toStrictEqual({
      message: 'userAlreadyExist'
    })
    done()
  })

  test('Empty payload', async done => {
    const payload = {}
    const response = await chai
      .request(server.listen())
      .post('/api/users')
      .send(payload)
    expect(response.status).toBe(HttpCodes.BAD_REQUEST)
    expect(response.type).toBe('application/json')
    expect(response.body).toStrictEqual({
      message: 'errEmptyPayload'
    })
    done()
  })
})
