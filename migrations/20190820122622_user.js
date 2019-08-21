exports.up = function(knex) {
  return knex.schema.createTable('user', table => {
    table.increments('id').primary()
    table
      .string('name', 50)
      .notNullable()
      .defaultTo('')
    table
      .boolean('active')
      .notNullable()
      .defaultTo(false)
    table.string('password_digest').notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('user')
}
