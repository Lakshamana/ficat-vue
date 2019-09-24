exports.up = function(knex) {
  return knex.schema.createTable('catalogCards', table => {
    table.increments('id').primary()
    table
      .enum('type', ['tccGraduation', 'tccExpert', 'dissertation', 'thesis'])
      .notNullable()
      .defaultTo('tccGraduation')
    table.timestamp('datetime').defaultTo(knex.fn.now())
    table.integer('unityId').unsigned()
    table.integer('courseId').unsigned()
    table.foreign('unityId').references('academicUnities.id')
    table.foreign('courseId').references('courses.id')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('catalogCards')
}
