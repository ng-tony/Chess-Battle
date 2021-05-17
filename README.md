# Chess-Battle

[https://chess.ng-tony.ca/](https://chess.ng-tony.ca/)

Basically chess with powerups.

Currently only the client is hosted. I.e Backend is not hosted, so no online games yet.

## Run

Start with `yarn dev`

or `yarn server` and `yarn client`

## Powerups

* Guard: Captures pieces that walk into it's available squares
* Shield: Piece cannot be captured
* Sword: Movement will capture pieces directly adjacent to it's landing spot
* Flail: Movement will capture pieces diagonally adjacent to it's landing spot
    
## How to play

Make your own rules

Regular rules + add one powerup at the end of the turn?

Powerup takes a move?

Should you be able to stack powerups? Take powerups from your opponents?

## Multiplayer

_As noted, multiplayer is currently not hosted._

Rooms are joined through the url query _game_ ex. `http://localhost:3000/?game=test`
