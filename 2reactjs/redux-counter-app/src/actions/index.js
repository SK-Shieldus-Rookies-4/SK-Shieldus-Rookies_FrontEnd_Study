/*
action 객체를 만드는 액션 생성 함수들을 선언합니다
(action creators).
여기서 () => ({})은 function() { return { } }와
동일한 의미입니다.
*/
import * as types from './ActionTypes';

//상태변수 값을 증가시키는 액션함수
export const increment = () => ({
    type: types.INCREMENT
});

//상태변수 값을 감소시키는 액션함수
export const decrement = () => ({
    type: types.DECREMENT
});


//상태변수의 color를 변경하는 액션함수
export const setColor = (color) => ({
    type: types.SET_COLOR,
    color
});
