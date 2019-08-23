exports.up = function(knex) {
  return knex.schema.createTable('knowledgeAreas', table => {
    table.increments('id').primary()
    table
      .string('code', 15)
      .notNullable()
      .defaultTo('')
    table
      .string('description', 50)
      .notNullable()
      .defaultTo('')
    table.unique('code')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('knowledgeAreas')
}
