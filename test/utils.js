const { knex } = require('../server/db')
// const User = require('../server/models/User')
// const KnowledgeArea = require('../server/models/KnowledgeArea')

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
function createSeeds(entityName) {
  const model = models[entityName]
  const data = seeds[entityName]
  return knex.transaction(trx => {
    return Promise.all(
      data.map(payload =>
        model.forge({}).save(payload, {
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
function wipeTable(tableName) {
  const model = models[tableName]
  return model.where('id', '!=', '0').destroy()
}

module.exports = { createSeeds, wipeTable }
