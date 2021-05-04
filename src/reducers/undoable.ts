import { decodeActionForDisplay } from "./board"

const history = (reducer: any) => {
    // Call the reducer with empty action to populate the initial state
    const initialState = {
        past: [],
        present: {move: "", squares:reducer(undefined, {})},
        future: [],
    }

    // Return a reducer that handles undo and redo
    return function (state = initialState, action: any) {
        const { past, present, future } = state
        switch (action.type) {
            case 'UNDO':
                if (past.length > 0){
                    const previous = past[past.length - 1]
                    const newPast = past.slice(0, past.length - 1)
                    return {
                        past: newPast,
                        present: previous,
                        future: [present, ...future],
                    }
                }
                break;
            case 'REDO':
                if (future.length > 0){
                    const next = future[0]
                    const newFuture = future.slice(1)
                    return {
                        past: [...past, present],
                        present: next,
                        future: newFuture,
                    }
                }
                break;
            case 'JUMP':
                const step = action.step;
                if (step === past.length) { return state }
                if (step < past.length) {
                    const newPast = past.slice(0, step);
                    const newPresent = past[step];
                    const newFuture = [...past.slice(step+1), present, ...future];
                    return {
                        past: newPast,
                        present: newPresent,
                        future: newFuture
                    }
                } else {
                    const fIndex = step - past.length -1;
                    const newPast =[...past, present, ...future.slice(0, fIndex)];
                    const newPresent = future[fIndex]
                    const newFuture = future.slice(fIndex + 1)
                    return {
                        past: newPast,
                        present: newPresent,
                        future: newFuture
                    }
                }
            default:
                // Delegate handling the action to the passed reducer
                const newPresent = {
                    move:decodeActionForDisplay(present.squares, action),
                    squares: reducer(present.squares, action)
                }
            
                if (present.squares === newPresent.squares) {
                    return state
                }
                return {
                    past: [...past, present],
                    present: newPresent,
                    future: [],
                }
        }
        return state;
    }
}

export default history
