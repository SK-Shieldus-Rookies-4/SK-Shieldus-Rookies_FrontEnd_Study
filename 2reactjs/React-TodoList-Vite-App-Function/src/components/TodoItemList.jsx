import { memo } from 'react';
import PropTypes from 'prop-types';
import TodoItem from './TodoItem';

const TodoItemList = ({ myTodos, myToggle, myRemove }) => {
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
  myTodos: PropTypes.array,
  myToggle: PropTypes.func,
  myRemove: PropTypes.func
};

// memo를 사용하여 shouldComponentUpdate 대체
// myTodos가 변경될 때만 리렌더링
export default memo(
  TodoItemList,
  (prevProps, nextProps) => prevProps.myTodos === nextProps.myTodos
);