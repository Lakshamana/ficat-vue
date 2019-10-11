const { knex } = require('../server/db')
const User = require('../server/models/User')
const { tokenSign } = require('../server/util/utils')

/**
 * Obter um usuário de teste e seu token
 * @param  {string} username - Nome do usuário
 * @param  {number} exp - Tempo de expiração de token em segundos
 * @return {object} User and token
 */
async function user(username, rememberMe) {
  const user = await User.where({ username }).fetch()
  const tokens = await tokenSign(user, rememberMe)
  return { user, tokens }
}

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

module.exports = { createSeeds, wipeTable, user }
