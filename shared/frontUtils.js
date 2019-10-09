/**
 * Seleciona atributos de um dado objeto de entrada,
 * com base em uma lista dos atributos do mesmo.
 * Aceita valores padrão que serão adicionados ou
 * sobrescritos pelo objeto de entrada ao objeto de saída.
 *
 * @param {Object} dataObj: carga útil de entrada
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
export function select(data, attrList, defaults = {}) {
  const dataObj = Object.assign({}, data) // Evitar problemas com hasOwnProperty
  if (dataObj && typeof dataObj === 'object') {
    if (dataObj.id) {
      delete dataObj.id
    }
    const selected = { ...defaults }
    for (const d in dataObj) {
      // hasOwnProperty - herança é ignorada
      if (dataObj.hasOwnProperty(d) && attrList.includes(d)) {
        selected[d] = dataObj[d]
      }
    }
    return selected
  }
}

/**
 * Modo de uso:
 * const obj = {a: 1, c: 3}
 * const r = {...maybe('a', obj.a), ...maybe('b', obj.c), ...maybe('c', false)}
 * r // => {a: 1, b: 3}
 * @param {*} key
 * @param {*} value
 */
export function maybe(key, value) {
  return value && { [key]: value }
}

/**
 * 21 => uppercase ? XXI : xxi
 * @param {Number} n
 * @param {Boolean} uppercase
 */
export function romanize(n, uppercase = false) {
  let r = ''
  const romans = {
    1: 'i',
    4: 'iv',
    5: 'v',
    9: 'ix',
    10: 'x',
    40: 'xl',
    50: 'l',
    90: 'xc',
    100: 'c',
    400: 'cd',
    500: 'd',
    900: 'cm',
    1000: 'm'
  }

  while (n > 0) {
    let choice
    for (const r in romans) {
      if (n >= r) choice = r
      else break
    }
    r += romans[choice]
    n -= choice
  }
  return uppercase ? r.toUpperCase() : r
}

export function encode(str) {
  return btoa(unescape(encodeURIComponent(str)))
}

export function decode(str) {
  return decodeURIComponent(escape(window.atob(str)))
}
