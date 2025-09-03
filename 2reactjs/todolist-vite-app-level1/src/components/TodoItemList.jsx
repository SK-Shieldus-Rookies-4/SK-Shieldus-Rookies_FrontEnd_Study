import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

//import { fetchAllTodos } from '@/actions'
import { fetchAllTodos } from '@/reducers/todoSlice';
import TodoItem from '@components/TodoItem';

class TodoItemList extends Component {
    componentDidMount() {
        this.props.getTodos();
    }
    /*
        true 리턴 (myTodos 변수에 변동이 있는 경우)이면 render() 함수가 호출됨
        false 리턴 (myTodos 변수에 변동이 없는 경우)이면 render() 함수가 호출되지 않음(렌더링 생략)
    */
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.myTodos !== nextProps.myTodos;
    }

    render() {
        const { myTodos } = this.props;
        /*
           const { id,text,checked } = todo;
        */
        const todoList = myTodos.map(({ id, text, checked }) => (
            <TodoItem id={id}
                text={text}
                checked={checked}
                key={id}
            />
        ));
        return (
            <div>
                {todoList}
            </div>
        );
    }
}

TodoItemList.propTypes = {
    myTodos: PropTypes.array,
    getTodos: PropTypes.func,
};
export default connect(
    //store에 저장된 todos를 가져와서 myTodos 프로퍼티에 매핑하기
    (state) => ({myTodos: state.todos}),
    //action함수를 dispatch 하는 함수를 getTodos 프로퍼티에 매핑하기
    { getTodos: fetchAllTodos } // fetchAllTodos 프로터티에 매핑한다면 { fetchAllTodos }
)(TodoItemList);