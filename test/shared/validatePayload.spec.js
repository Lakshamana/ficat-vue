import { validatePayload } from '@/shared/utils'

describe('validatePayload', () => {
  test('all fields are mandatory', done => {
    const data = {
      name: 'Brian Cohen',
      password: 'romaniitedomus',
      active: false
    }
    const paramList = ['name', 'password', 'active']
    const result = validatePayload(data, paramList)
    expect(result).toEqual({
      valid: true
    })
    done()
  })

  test('some fields are mandatory', done => {
    const data = {
      name: 'Brian Cohen',
      password: 'romaniitedomus'
    }
    const paramList = ['name', 'password', 'active']
    const result = validatePayload(data, paramList, ['active'])
    expect(result).toEqual({
      valid: true
    })
    done()
  })

  test('none fields are mandatory', done => {
    const data = {
      name: 'Brian Cohen',
      active: true
    }
    const paramList = ['name', 'password', 'active']
    const result = validatePayload(data, paramList, paramList)
    expect(result).toEqual({
      valid: true
    })
    done()
  })

  test('some fields are missing', done => {
    const data = {
      name: 'Brian Cohen',
      password: 'romaniitedomus'
    }
    const paramList = ['name', 'password', 'active']
    const result = validatePayload(data, paramList)
    expect(result).toEqual({
      valid: false,
      missingFields: ['active']
    })
    done()
  })

  test('some fields are invalid', done => {
    const data = {
      name: 'Brian Cohen',
      password: 'romaniitedomus',
      friendOf: 'Biggus Dickus'
    }
    const paramList = ['name', 'password']
    const result = validatePayload(data, paramList)
    expect(result).toEqual({
      valid: false,
      invalidFields: ['friendOf']
    })
    done()
  })

  test('some fields are written wrong', done => {
    const data = {
      name: 'Brian Cohen',
      passord: 'romaniitedomus',
      active: false
    }
    const paramList = ['name', 'password', 'active']
    const result = validatePayload(data, paramList)
    expect(result).toEqual({
      valid: false,
      missingFields: ['password'],
      invalidFields: ['passord']
    })
    done()
  })
})
