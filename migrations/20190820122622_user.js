exports.up = function(knex) {
  return knex.schema.createTable('user', table => {
    table.increments('id').primary()
    table
      .string('name', 50)
      .notNullable()
      .defaultTo('')
    table.string('passwordDigest').notNullable()
  })
}

exports.down = function(knex) {
  knex.schema.dropTable('user')
}
