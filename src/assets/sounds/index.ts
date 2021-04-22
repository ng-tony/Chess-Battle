
const move = require('./move.wav')
const capture =  require('./capture.mp3')


export const sounds = { move, capture}
export type SoundsKey = keyof typeof sounds;
