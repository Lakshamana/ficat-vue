const seeds = require('./seeds_data/catalogCards_seeds')
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('catalogCards')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('catalogCards').insert(seeds)
    })
}
