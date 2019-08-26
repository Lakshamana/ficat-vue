/**
 * Seleciona atributos de um dado objeto de entrada,
 * com base em uma lista dos atributos do mesmo.
 * Aceita valores padrão que serão adicionados ou
 * sobrescritos pelo objeto de entrada ao objeto de saída.
 *
 * @param {Object} data: carga útil de entrada
 *
 * @param {Array} attrList: lista de atributos selecionados do objeto
 *
 * @param {Object} defaults: inicia com `{}` caso não informado.
 * Caso `data` contenha algum atributo em comum com `defaults`,
 * esses valores serão sobrescritos no objeto de saída ou
 * serão apenas adicionados, caso contrário.
 *
 * @returns {Object} selected: objeto de saída
 *
 * @see utils.spec.js (/test/shared/ para casos de teste)
 */
function select(data, attrList, defaults = {}) {
  if (data && typeof data === 'object') {
    if (data.id) {
      delete data.id
    }
    const selected = { ...defaults }
    for (const d in data) {
      // hasOwnProperty - herança é ignorada
      if (data.hasOwnProperty(d) && attrList.includes(d)) {
        selected[d] = data[d]
      }
    }
    return selected
  }
}

/**
 * Valida atributos de um dado objeto de entrada,
 * com base em uma lista dos atributos do mesmo.
 *
 * @param {Object} data: carga útil de entrada (payload)
 *
 * @param {Array} validFields: lista de atributos do objeto
 * válidos e deve conter todos os dados possíveis para o payload,
 * obrigatórios ou opcionais. Invalida o payload caso vazio.
 * (default: [])
 *
 * @param {Array} optional: indica quais campos válidos são opcionais
 * (default: [])
 *
 * @returns {Object}
 *  { valid: `true` -> `data` válido | `false` caso contrário,
 *    fields: `[campos inválidos]` -> caso `data` seja inválido
 *  }
 *
 * @see utils.spec.js (/test/shared/ para casos de teste)
 */
function validatePayload(data, validFields = [], optional = []) {
  const result = { valid: false }
  const dataObj = Object.assign({}, data) // Evitar problemas com hasOwnProperty
  if (dataObj && typeof dataObj === 'object') {
    // data precisa ter alguns campos
    for (const f of validFields) {
      if (!Object.keys(dataObj).includes(f) && !optional.includes(f)) {
        if (!result.missingFields) result.missingFields = []
        result.missingFields.push(f)
      }
    }
    // dataObj não deve ter alguns campos
    for (const d in dataObj) {
      // hasOwnProperty - não deve haver herança de objetos
      if (!dataObj.hasOwnProperty(d) || !validFields.includes(d)) {
        if (!result.invalidFields) result.invalidFields = []
        result.invalidFields.push(d)
      }
    }
    if (!result.invalidFields && !result.missingFields) result.valid = true
    return result
  }
  return undefined
}

module.exports = { validatePayload, select }
