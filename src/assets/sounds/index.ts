
const move = require('./move.wav')
const capture =  require('./capture.wav')


export const sounds = { move, capture}
export type SoundsKey = keyof typeof sounds;
