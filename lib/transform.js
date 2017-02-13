import camelCase from 'to-camel-case'
import log from './log'

const transformKey = keyin => ({
  'Phone Numbers - Lookup': 'phoneNumbers'
}[keyin] || camelCase(keyin))

const keyinIgnore = ['Phone Numbers']

export default {
  in: obj => Object.keys(obj).filter(key => !keyinIgnore.includes(key)).reduce((acc, key) =>
    Object.assign({
      [transformKey(key)] : obj[key]
    }, acc)
  , {}),
  out: obj => Object.keys(obj).reduce((acc, key) =>
    Object.assign({
      [{
        phoneNumbers: 'phones',
        emailAddresses: 'emails'
      }[key] || key] : obj[key]
    }, acc)
  , {})
}
