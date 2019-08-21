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
function validatePayload(data, validFields = []) {
  const result = { valid: false }
  if (data && typeof data === 'object') {
    for (const d in data) {
      // hasOwnProperty - herança é ignorada
      if (!data.hasOwnProperty(d) || !validFields.includes(d)) {
        if (!result.fields) result.fields = []
        result.fields.push(d)
      }
    }
    if (!result.fields) result.valid = true
    return result
  }
  return undefined
}

module.exports = { validatePayload, select }
