"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var board_1 = __importDefault(require("./board"));
var undoable_1 = __importDefault(require("./undoable"));
var redux_1 = require("redux");
var gameInfo_1 = __importDefault(require("./gameInfo"));
var allReducers = redux_1.combineReducers({
    board: undoable_1.default(board_1.default),
    gameInfo: gameInfo_1.default,
});
exports.default = allReducers;
