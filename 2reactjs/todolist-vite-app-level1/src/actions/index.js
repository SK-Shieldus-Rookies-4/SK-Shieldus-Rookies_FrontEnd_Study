import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const apiUrl = `${BASE_URL}/todos`;

//Action type 정의
export const FETCH_TODOS = 'FETCH_TODOS';

//Todolist Act
export const fetchAllTodos = () => {
    return (dispatch) => {
        axios.get(apiUrl) //Promise
            .then(res => dispatch ({
                    type: FETCH_TODOS,
                    payload: res.data,
            }))
            .catch((error) => {
                console.log(error);
                throw error;
            });
    }
};