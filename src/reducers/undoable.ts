const undoable = (reducer: any) => {
    // Call the reducer with empty action to populate the initial state
    const initialState = {
        past: [],
        present: reducer(undefined, {}),
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
            default:
                // Delegate handling the action to the passed reducer
                const newPresent = reducer(present, action)
                if (present === newPresent) {
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

export default undoable
