const move = require('./move.wav')
const capture =  require('./capture.wav')
const power =  require('./power.wav')
const add = require('./move.wav')

export const sounds = { move, capture, power, add}
export type SoundsKey = keyof typeof sounds;
