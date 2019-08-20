const seeds = require('./seeds_data/user_seeds')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('user').insert(seeds)
    })
}
