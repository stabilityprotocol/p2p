import debug from 'debug'

const _log = debug('p2p')

export const error = _log.extend('error')

export const warn = _log.extend('warn')
warn.log = console.warn.bind(console)

export const info = _log.extend('info')
info.log = console.info.bind(console)

export const log = _log.extend('log')
log.log = console.log.bind(console)
