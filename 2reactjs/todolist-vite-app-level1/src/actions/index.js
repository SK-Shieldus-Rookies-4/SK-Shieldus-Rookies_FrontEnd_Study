import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const apiUrl = `${BASE_URL}/todos`;

//Action type 정의
export const FETCH_TODOS = "FETCH_TODOS";
export const ADD_TODO = "ADD_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";

//TodoList Action 함수
export const fetchAllTodos = () => {
    return (dispatch) => {
        axios.get(apiUrl) //Promise
            .then(res => dispatch({
                type: FETCH_TODOS,
                payload: res.data
            }))
            .catch(error => {
                console.log(error);
                throw error;
            });
    }
}; //fetchAllTodos

//Todo 등록 Action 함수
export const addTodo = (todo) => {
    return (dispatch) => {
        axios.post(apiUrl, todo)
            .then(res => {
                dispatch({
                    type: ADD_TODO,
                    payload: res.data
                })
            })
            .catch(error => {
                console.log(error);
                throw (error);
            })
    }
}; //addTodo

//Todo 토글링 Action 함수
export const toggleTodo = todo => {
    return (dispatch) => {
        axios.patch(`${apiUrl}/${todo.id}`, todo)
            .then(res => {
                dispatch({
                    type: TOGGLE_TODO,
                    payload: res.data
                })
            })
            .catch(error => {
                console.log(error);
                throw (error);
            })
    }
}