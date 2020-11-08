const { bookshelf } = require('../db')
const { castDate } = require('../../shared/utils')

module.exports = bookshelf.Model.extend({
  tableName: 'catalogCards',
  initialize() {
    this.on('saving', async model => {
      const date = model.get('datetime')
      const datetime = date ? new Date() : new Date()
      const castedDate = await castDate(datetime)
      model.set('datetime', castedDate)
    })
  }
})
