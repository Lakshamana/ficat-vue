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
 * válidos e pode conter mais campos que data. Invalida o payload caso vazio.
 *
 * @returns {Object}
 *  { valid: `true` -> `data` válido | `false` caso contrário,
 *    fields: `[campos inválidos]` -> caso `data` seja inválido
 *  }
 *
 * @see utils.spec.js (/test/shared/ para casos de teste)
 */
function validatePayload(data, validFields = [], optional = false) {
  const result = { valid: false }
  if (data && typeof data === 'object') {
    // data precisa ter alguns campos
    if (!optional) {
      for (const f of validFields) {
        if (!Object.keys(data).includes(f)) {
          if (!result.missingFields) result.missingFields = []
          result.missingFields.push(f)
        }
      }
    }
    // data não deve ter alguns campos
    for (const d in data) {
      // hasOwnProperty - não deve haver herança de objetos
      if (!data.hasOwnProperty(d) || !validFields.includes(d)) {
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
