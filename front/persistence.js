import { select } from '@/shared/frontUtils'

export function persist(key, value, options) {
  const modList = ['exp', 'path', 'domain', 'secure']
  const { exp, path, domain, secure } = select(options, modList)
  window.$cookies.set(key, value, exp, path, domain, secure)
}

export function recovery(key) {
  return window.$cookies.get(key)
}

export function replace(key, value) {
  const curr = window.$cookies.get(key)
  const newVal = Object.assign(curr, value)
  persist(key, newVal)
}
