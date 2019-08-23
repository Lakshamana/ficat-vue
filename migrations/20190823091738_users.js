exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table
      .string('username', 50)
      .notNullable()
      .primary()
    table
      .boolean('active')
      .notNullable()
      .defaultTo(false)
    table.string('password_digest').notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('users')
}
