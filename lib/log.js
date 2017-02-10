function isClient() {
  return typeof window !== 'undefined'
}

function debug(msg) {
  console.debug('DEBUG', msg)
}

function info(msg) {
  console.info('INFO', msg)
}

function error(err) {
  console.error('ERROR', err)
}

const log = {
  debug,
  info,
  error
}

export default log
