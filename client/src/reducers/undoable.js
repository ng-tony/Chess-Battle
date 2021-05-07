"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var board_1 = require("./board");
var history = function (reducer) {
    // Call the reducer with empty action to populate the initial state
    var initialState = {
        past: [],
        present: { move: "", squares: reducer(undefined, {}) },
        future: [],
    };
    // Return a reducer that handles undo and redo
    return function (state, action) {
        if (state === void 0) { state = initialState; }
        var past = state.past, present = state.present, future = state.future;
        switch (action.type) {
            case 'UNDO':
                if (past.length > 0) {
                    var previous = past[past.length - 1];
                    var newPast = past.slice(0, past.length - 1);
                    return {
                        past: newPast,
                        present: previous,
                        future: __spreadArray([present], future),
                    };
                }
                break;
            case 'REDO':
                if (future.length > 0) {
                    var next = future[0];
                    var newFuture = future.slice(1);
                    return {
                        past: __spreadArray(__spreadArray([], past), [present]),
                        present: next,
                        future: newFuture,
                    };
                }
                break;
            case 'JUMP':
                var step = action.step;
                if (step === past.length) {
                    return state;
                }
                if (step < past.length) {
                    var newPast = past.slice(0, step);
                    var newPresent_1 = past[step];
                    var newFuture = __spreadArray(__spreadArray(__spreadArray([], past.slice(step + 1)), [present]), future);
                    return {
                        past: newPast,
                        present: newPresent_1,
                        future: newFuture
                    };
                }
                else {
                    var fIndex = step - past.length - 1;
                    var newPast = __spreadArray(__spreadArray(__spreadArray([], past), [present]), future.slice(0, fIndex));
                    var newPresent_2 = future[fIndex];
                    var newFuture = future.slice(fIndex + 1);
                    return {
                        past: newPast,
                        present: newPresent_2,
                        future: newFuture
                    };
                }
            default:
                // Delegate handling the action to the passed reducer
                var newPresent = {
                    move: board_1.decodeActionForDisplay(present.squares, action),
                    squares: reducer(present.squares, action)
                };
                if (present.squares === newPresent.squares) {
                    return state;
                }
                return {
                    past: __spreadArray(__spreadArray([], past), [present]),
                    present: newPresent,
                    future: [],
                };
        }
        return state;
    };
};
exports.default = history;
