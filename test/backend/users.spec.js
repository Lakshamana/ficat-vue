/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')

const { knex } = require('../../server/db')
const { createSeeds, wipeTable, user } = require('../utils')
const server = require('../../server')
const HttpCodes = require('../../server/httpCodes')

chai.use(chaiHttp)
jest.useFakeTimers()
jest.setTimeout(100000)

// Suíte de testes da entidade users
describe('prefix /api/users', () => {
  beforeAll(() => knex.migrate.latest(), 100000)

  beforeEach(() => createSeeds('users'), 100000)

  afterEach(() => wipeTable('users'), 100000)

  test('List all users', async done => {
    const { tokens } = await user('admin')
    const response = await chai
      .request(server.listen())
      .get('/api/users')
      .set('x-xsrf-token', tokens.xsrfToken)
      .set('Cookie', `accessToken=${tokens.accessToken}`)

    expect(response.status).toBe(HttpCodes.OK)
    expect(response.type).toBe('application/json')
    expect(response.body).toBeDefined()
    done()
  })

  test('Create new user', async done => {
    const { tokens } = await user('admin')
    const payload = {
      username: 'person',
      password: 'person',
      active: true
    }

    const response = await chai
      .request(server.listen())
      .post('/api/users')
      .send(payload)
      .set('x-xsrf-token', tokens.xsrfToken)
      .set('Cookie', `accessToken=${tokens.accessToken}`)

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
    const { tokens } = await user('admin')
    const payload = {
      username: 'person',
      passwd: 'fancy-password', // Should be 'password'
      active: false
    }
    const response = await chai
      .request(server.listen())
      .post('/api/users')
      .send(payload)
      .set('x-xsrf-token', tokens.xsrfToken)
      .set('Cookie', `accessToken=${tokens.accessToken}`)
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
    const { tokens } = await user('admin')
    // Should have `username` property
    const payload = {
      active: true,
      password: 'fancy-password'
    }
    const response = await chai
      .request(server.listen())
      .post('/api/users')
      .send(payload)
      .set('x-xsrf-token', tokens.xsrfToken)
      .set('Cookie', `accessToken=${tokens.accessToken}`)
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
    const { tokens } = await user('admin')
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
      .set('x-xsrf-token', tokens.xsrfToken)
      .set('Cookie', `accessToken=${tokens.accessToken}`)
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
    const { tokens } = await user('admin')
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
      .set('x-xsrf-token', tokens.xsrfToken)
      .set('Cookie', `accessToken=${tokens.accessToken}`)

    // Try to create another one with same username
    const response = await chai
      .request(server.listen())
      .post('/api/users')
      .send(userCreationToFail)
      .set('x-xsrf-token', tokens.xsrfToken)
      .set('Cookie', `accessToken=${tokens.accessToken}`)
    expect(response.status).toBe(HttpCodes.BAD_REQUEST)
    expect(response.type).toBe('application/json')
    expect(response.body).toStrictEqual({
      message: 'userAlreadyExist'
    })
    done()
  })

  test('Empty payload', async done => {
    const { tokens } = await user('admin')
    const payload = {}
    const response = await chai
      .request(server.listen())
      .post('/api/users')
      .send(payload)
      .set('x-xsrf-token', tokens.xsrfToken)
      .set('Cookie', `accessToken=${tokens.accessToken}`)
    expect(response.status).toBe(HttpCodes.BAD_REQUEST)
    expect(response.type).toBe('application/json')
    expect(response.body).toStrictEqual({
      errors: [
        {
          errCode: 'missingFields',
          fields: 'username, password, active'
        }
      ],
      message: 'errOnPayloadValidation'
    })
    done()
  })
})
