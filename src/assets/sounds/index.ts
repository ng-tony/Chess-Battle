
const move = require('./move.wav').default
const capture =  require('./capture.mp3').default


export const sounds = { move, capture}
export type SoundsKey = keyof typeof sounds;
