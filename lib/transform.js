import camelCase from 'to-camel-case'
export default {
  in: obj => Object.keys(obj).reduce((acc, key) =>
    Object.assign({
      [{
        phoneNumbersLookup: 'phoneNumbers'
      }[camelCase(key)] || camelCase(key)] : obj[key]
    }, acc)
  , {}),
  out: obj => Object.keys(obj).reduce((acc, key) =>
    Object.assign({
      [{
        phoneNumbers: 'phoneNumbersLookup'
      }[key]] : obj[key]
    }, acc)
  , {})
}
