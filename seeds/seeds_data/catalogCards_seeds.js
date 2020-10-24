const { castDate } = require('../../shared/utils')

const length = 100
const rand = (min, max) => Math.floor(Math.random() * (max - min) + min)

const types = ['tccGraduation', 'tccExpert', 'dissertation', 'thesis']

function generate(length = 1000) {
  return Array.from({ length }, async (_, i) => ({
    id: i + 1,
    type: types[rand(0, 3)],
    datetime: await castDate(
      new Date(rand(2000, 2019), rand(0, 11), rand(1, 31)).toISOString()
    ),
    unityId: rand(1, 10),
    courseId: rand(1, 10)
  }))
}

module.exports = generate(length)
