const seeds = require('./seeds_data/academicUnities_seeds')
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('academicUnities')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('academicUnities').insert(seeds)
    })
}
