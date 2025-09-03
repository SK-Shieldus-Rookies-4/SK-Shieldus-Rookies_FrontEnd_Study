import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import TodoItem from './TodoItem';
import { fetchAllTodos } from '@/reducers/todoSlice';

const TodoItemList = ({ myToggle, myRemove }) => {
  const myTodos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  /*
    action 함수 dispatch 하기
    useEffect() hook
    componentDidMount + componentDidUpdate + componentWillUnMount
  */
  useEffect(() => {
    dispatch(fetchAllTodos());
  },[dispatch]);

  const todoList = myTodos.map(
    ({ id, text, checked }) => (
      <TodoItem
        id={id}
        text={text}
        checked={checked}
        onToggle={myToggle}
        onRemove={myRemove}
        key={id}
      />
    )
  );

  return (
    <div>
      {todoList}
    </div>
  );
};

TodoItemList.propTypes = {
  myToggle: PropTypes.func,
  myRemove: PropTypes.func
};

// memo를 사용하여 shouldComponentUpdate 대체
// myTodos가 변경될 때만 리렌더링
export default memo(
  TodoItemList,
  (prevProps, nextProps) => prevProps.myTodos === nextProps.myTodos
);