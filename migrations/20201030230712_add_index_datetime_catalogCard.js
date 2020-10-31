exports.up = function(knex) {
  return knex.table('catalogCards', table => {
    table.index(['datetime'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropIndex('datetime')
}
