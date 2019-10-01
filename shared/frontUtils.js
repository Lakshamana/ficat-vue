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
