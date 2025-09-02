import * as types from '../actions/ActionTypes';

// 초기 상태를 정의한 state 객체
const initialState = {

    color: 'black',
    number: 0

};

// reducer 함수
function counter(state = initialState, action) {
    switch (action.type) {
        case types.INCREMENT:
            return {
                ...state,
                number: state.number + 1
            };
        case types.DECREMENT:
            return {
                ...state,
                number: state.number - 1
            };
        case types.SET_COLOR:
            return {
                ...state,
                color: action.color
            };
        default:
            return state;

    }
};
export default counter;