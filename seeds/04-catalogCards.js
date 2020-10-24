const seeds = require('./seeds_data/catalogCards_seeds')
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('catalogCards')
    .del()
    .then(async function() {
      // Inserts seed entries
      const arr = await Promise.all(seeds)
      return knex('catalogCards').insert(arr)
    })
}
