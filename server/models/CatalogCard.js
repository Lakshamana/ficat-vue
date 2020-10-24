const { bookshelf } = require('../db')
const { castDate } = require('../../shared/utils')

module.exports = bookshelf.Model.extend({
  tableName: 'catalogCards',
  async format(attributes) {
    const date = attributes.datetime || new Date().toISOString()
    attributes.datetime = await castDate(date)
  },
  initialize() {
    this.constructor.__super__.initialize.apply(this, arguments)

    // Setting up a listener for the 'saving' event
    this.on('creating', async model => {
      await model.format(this.attributes)
    })
  }
})
