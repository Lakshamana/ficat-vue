const { knex } = require('../server/db')

const models = {
  users: require('../server/models/User'),
  knowledgeAreas: require('../server/models/KnowledgeArea')
}

const seeds = {
  users: require('../seeds/seeds_data/users_seeds'),
  knowledgeAreas: require('../seeds/seeds_data/knowledgeAreas_seeds')
}

/**
 * Cria seeds com base em nome de uma entidade
 * @param {String} entityName === tableName
 */
async function createSeeds(entityName) {
  const model = models[entityName]
  const data = seeds[entityName]
  await knex.transaction(trx => {
    return Promise.all(
      data.map(payload =>
        model.forge(payload).save({
          transacting: trx
        })
      )
    )
  })
}

/**
 * Limpa uma tabela da base de dados
 * @param {String} tableName
 */
async function wipeTable(tableName) {
  await models[tableName].destroy()
}

module.exports = { createSeeds, wipeTable }
