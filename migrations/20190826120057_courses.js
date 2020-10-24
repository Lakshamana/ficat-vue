exports.up = function(knex) {
  return knex.schema.createTable('courses', table => {
    table.increments('id').primary()
    table
      .string('name', 120)
      .notNullable()
      .defaultTo('')
    table
      .string('program', 10)
      .notNullable()
      .unique()
    table
      .enum('type', ['graduation', 'specialization', 'master', 'doctorate'])
      .notNullable()
      .defaultTo('graduation')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('courses')
}
