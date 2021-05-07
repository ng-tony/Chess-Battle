"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeActionForDisplay = void 0;
var GameLogic_1 = require("../GameLogic");
var immer_1 = __importDefault(require("immer"));
var decodeActionForDisplay = function (state, action) {
    switch (action.type) {
        case 'EDIT':
            return "e:" + GameLogic_1.pieceToLetter(action.val) + GameLogic_1.indexToCoord(action.loc);
        case 'MOVE_PIECE':
            return GameLogic_1.pieceToLetter(state[action.from]) + GameLogic_1.indexToCoord(action.to);
        case 'ADD_POWERUP':
            return "pow";
        case 'REMOVE_POWERUPS':
            return "pow";
        default:
            return "";
    }
};
exports.decodeActionForDisplay = decodeActionForDisplay;
var defaultState = [
    GameLogic_1.decodePiece('wr'), GameLogic_1.decodePiece('wn'), GameLogic_1.decodePiece('wb'), GameLogic_1.decodePiece('wk'), GameLogic_1.decodePiece('wq'), GameLogic_1.decodePiece('wb'), GameLogic_1.decodePiece('wn'), GameLogic_1.decodePiece('wr'),
    GameLogic_1.decodePiece('wp'), GameLogic_1.decodePiece('wp'), GameLogic_1.decodePiece('wp'), GameLogic_1.decodePiece('wp'), GameLogic_1.decodePiece('wp'), GameLogic_1.decodePiece('wp'), GameLogic_1.decodePiece('wp'), GameLogic_1.decodePiece('wp'),
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    GameLogic_1.decodePiece('bp'), GameLogic_1.decodePiece('bp'), GameLogic_1.decodePiece('bp'), GameLogic_1.decodePiece('bp'), GameLogic_1.decodePiece('bp'), GameLogic_1.decodePiece('bp'), GameLogic_1.decodePiece('bp'), GameLogic_1.decodePiece('bp'),
    GameLogic_1.decodePiece('br'), GameLogic_1.decodePiece('bn'), GameLogic_1.decodePiece('bb'), GameLogic_1.decodePiece('bk'), GameLogic_1.decodePiece('bq'), GameLogic_1.decodePiece('bb'), GameLogic_1.decodePiece('bn'), GameLogic_1.decodePiece('br'),
];
var boardReducer = function (state, action) {
    if (state === void 0) { state = defaultState; }
    return immer_1.default(state, function (draftState) {
        var _a, _b;
        switch (action.type) {
            case 'EDIT':
                if (action.val.type === GameLogic_1.PieceType.Blank) {
                    draftState[action.loc] = null;
                }
                else {
                    draftState[action.loc] = action.val;
                }
                break;
            case 'MOVE_PIECE':
                draftState = GameLogic_1.moveSucessResults(action.from, action.to, draftState);
                break;
            case 'ADD_POWERUP':
                if (draftState[action.loc] && !((_a = state[action.loc]) === null || _a === void 0 ? void 0 : _a.powerUps.reduce(function (acc, pup) {
                    return acc || pup.type === action.powerUp.type;
                }, false))) {
                    draftState[action.loc].powerUps.push(action.powerUp);
                }
                break;
            case 'REMOVE_POWERUPS':
                if (draftState[action.loc] && ((_b = draftState[action.loc]) === null || _b === void 0 ? void 0 : _b.powerUps) !== []) {
                    draftState[action.loc].powerUps = [];
                }
                break;
            default:
                return;
        }
    });
};
exports.default = boardReducer;
