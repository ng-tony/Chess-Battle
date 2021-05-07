"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var immer_1 = __importDefault(require("immer"));
var Square_1 = require("../components/BuildingBlocks/Square");
var defaultState = {
    selectedSquare: Square_1.NULL_SQUARE,
    flippedBoard: false,
    hideEditor: false,
    squaresSelected: [],
    about: false,
    lastMove: { from: -1, to: -1 }
};
var gameInfoReducer = function (state, action) {
    if (state === void 0) { state = defaultState; }
    return immer_1.default(state, function (draftState) {
        switch (action.type) {
            case 'FLIP_BOARD':
                draftState.flippedBoard = !draftState.flippedBoard;
                break;
            case 'SELECT_SQUARE':
                draftState.selectedSquare = action.selectedSquare;
                break;
            case 'TOGGLE_EDITOR':
                draftState.hideEditor = !draftState.hideEditor;
                break;
            case 'MOVE_PIECE':
                draftState.lastMove = { from: action.from, to: action.to, };
                break;
            case 'TOGGLE_ABOUT':
                draftState.about = !draftState.about;
                break;
            default:
                return;
        }
    });
};
exports.default = gameInfoReducer;
