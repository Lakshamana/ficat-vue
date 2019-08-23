const seeds = require('./seeds_data/knowledgeAreas_seeds')
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('knowledgeAreas')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('knowledgeAreas').insert(seeds)
    })
}
