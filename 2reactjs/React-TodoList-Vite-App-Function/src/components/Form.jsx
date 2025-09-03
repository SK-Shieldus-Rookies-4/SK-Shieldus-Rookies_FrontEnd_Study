import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { addTodo } from '@/reducers/todoSlice';
import './Form.css';

const Form = () => {
  const [todo, setTodo] = useState('');
  const dispatch = useDispatch();

  //이벤트핸들러 함수 선언
  const handleChange = useCallback((e) => {
    //console.log('handleChange =' + e.target.value);
    setTodo(e.target.value);
  }, [setTodo]); //handleChange

  /*
    useCallback Hook은 함수를 메모이제이션하여 동일한 함수 참조를 유지합니다
    handleCreate 함수가 useCallback으로 감싸여 있어서 dispatch와 todo가 변경되지 않는 한 동일한 함수참조를 유지합니다.
  */
  const handleCreate = useCallback(() => {
    console.log('handleCreate');
    const newTodo = {
      text: todo,
      checked: false
    }
    //addTodo Action함수호출
    dispatch(addTodo(newTodo));
    setTodo('');

  }, [dispatch, todo]);

  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      handleCreate();
    }
  }

  return (
    <div className="form">
      <input
        value={todo}
        onChange={handleChange}
        onKeyDown={handleEnter}
      />
      <div className="create-button" onClick={handleCreate}>
        추가
      </div>
    </div>
  );
};

export default Form;