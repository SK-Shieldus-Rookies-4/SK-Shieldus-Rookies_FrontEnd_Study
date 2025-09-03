import Form from '@components/Form';
import TodoItemList from '@components/TodoItemList';
import TodoListTemplate from '@components/TodoListTemplate';

const App = () => {
  return (
    <TodoListTemplate form={<Form />}>
      <TodoItemList />
    </TodoListTemplate>
  );
}
export default App;