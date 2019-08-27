exports.up = function(knex) {
  return knex.schema.createTable('academicUnities', table => {
    table.increments('id').primary()
    table
      .string('name', 120)
      .notNullable()
      .defaultTo('')
    table
      .string('acronym', 10)
      .notNullable()
      .unique()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('academicUnities')
}
