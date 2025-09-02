import { Component } from 'react';
import PropTypes from 'prop-types';
import TodoItem from './TodoItem';

class TodoItemList extends Component {
    /*
       true 리턴 (myTodos 변수에 변경이 있는 경우)이면 render() 함수가 호출됨
       false 리턴 (myTodos 변수에 변경이 없는 경우)이면 render() 함수가 호출되지 않음
    */
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.myTodos !== nextProps.myTodos;
    }

    render() {
        const { myTodos, myToggle, myRemove } = this.props;
        /*
           const { id,text,checked } = todo;
        */
        const todoList = myTodos.map(({ id, text, checked }) => (
            <TodoItem id={id}
                text={text}
                checked={checked}
                onToggle={myToggle}
                onRemove={myRemove}
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
    myToggle: PropTypes.func,
    myRemove: PropTypes.func
};
export default TodoItemList;