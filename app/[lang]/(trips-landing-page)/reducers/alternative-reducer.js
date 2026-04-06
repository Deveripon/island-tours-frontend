export const alternativesReducer = (state, action) => {
    switch (action.type) {
        case 'SELECT_ALTERNATIVE':
            return {
                ...state,
                [action.payload.type]: {
                    ...state[action.payload.type],
                    [action.payload.dayId]: action.payload.optionData,
                },
            };

        case 'REMOVE_ALTERNATIVE':
            const updated = { ...state };
            if (updated[action.payload.type]) {
                delete updated[action.payload.type][action.payload.dayId];
            }
            return updated;

        case 'APPLY_PENDING':
            return action.payload.pendingAlternatives;

        case 'CLEAR_ALL':
            return {
                hotel: {},
                meals: {},
                transportation: {},
                activities: {},
                sightseeing: {},
            };

        case 'LOAD_FROM_REDIS':
            return (
                action.payload || {
                    hotel: {},
                    meals: {},
                    transportation: {},
                    activities: {},
                    sightseeing: {} });

        default:
            return state;
    }
};

