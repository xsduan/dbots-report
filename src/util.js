function deepEquals(a, b) {
  if (a === b) return true
  if (typeof a !== typeof b) return false

  const ak = Object.keys(a)
  const bk = Object.keys(b)
  if (ak.length !== bk.length) return false

  ak.sort()
  bk.sort()

  for (let i = 0; i < ak.length; i++) {
    if (ak[i] !== bk[i]) return false
    k = ak[i]
    if (!deepEquals(a[k], b[k])) return false
  }

  return true
}

module.exports = {
  resolveArray(arrObj, isArray = Array.isArray) {
    if (arrObj === undefined) return []
    return isArray(arrObj) ? arrObj : [arrObj]
  },
  deepEquals,
}
