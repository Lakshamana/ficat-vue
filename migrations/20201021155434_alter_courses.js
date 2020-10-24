exports.up = function(knex) {
  return knex.schema.table('courses', table => {
    table.integer('unityId').unsigned()
    table.foreign('unityId').references('academicUnities.id')
  })
}

exports.down = function(knex) {
  return knex.schema.table('courses', table => {
    table.dropForeign('unityId')
  })
}
