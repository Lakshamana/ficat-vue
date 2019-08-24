exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table
      .string('username', 50)
      .notNullable()
      .unique()
    table
      .boolean('active')
      .notNullable()
      .defaultTo(true)
    table.string('password_digest').notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('users')
}
