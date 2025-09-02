//node, express 로 구성한 restful webservice
const express = require('express');
const cors = require('cors');
const port = 4500;
const app = express();

let nextId = 4;

let todos = [
  {
    id: 1,
    text: 'Todo1',
    checked: false
  },
  {
    id: 2,
    text: 'Todo2',
    checked: false
  },
  {
    id: 3,
    text: 'Todo3',
    checked: true
  },
];

app.use(express.json());
// static middleware를 사용하겠다
app.use(express.static('public'));
// cores middleware를 사용하겠다
app.use(cors());

//Todo 전체 조회
app.get('/api/todos', (req, res) => {
  setTimeout(() => {
    res.send(todos);
  }, 1000);
});

//Todo 1개 조회
app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);

  if (todo) {
    res.status(200).json(todo);
  } else {
    res.status(404).send({ msg: 'Todo not found' });
  }
});

//Todo 등록
app.post('/api/todos', (req, res) => {
  const todo = { id: getNextId(), ...req.body };
  todos = [...todos, todo];
  console.log('post ',todos);
  res.send(todos);
});

//Todo 전체 삭제
app.delete('/api/todos', (req, res) => {
  todos.splice(0, todos.length);
  res.send(todos);
});

//Todo 1개 삭제
app.delete('/api/todos/:id', function (request, response) {
  // 변수를 선언합니다.
  var id = Number(request.params.id);
  const todoIndex = todos.findIndex(f => f.id == id);
  console.log('delete ', id);
  
  if (isNaN(id)) {
    // 오류: 잘못된 경로
    response.send({
      error: '숫자를 입력하세요!'
    });
  } else if (todos[todoIndex]) {
    // 정상: 데이터 삭제
    todos.splice(todoIndex, 1);
    response.send(todos);
  } else {
    // 오류: 요소가 없을 경우
    response.send({
      error: '존재하지 않는 데이터입니다!'
    });
  }
});

//Todo 수정
app.patch('/api/todos/:id', (req, res) => {
  var id = Number(req.params.id);

  const todoIndex = todos.findIndex(f => f.id == id);

  if (todoIndex > -1) {
    const todo = { ...todos[todoIndex], ...req.body };
    console.log('patch ',todo.id, todo.checked);
  
    todos = [
      ...todos.slice(0, todoIndex),
      todo,
      ...todos.slice(todoIndex + 1),
    ];

    res.send(todos);
  } else {
    res.status(404).send({ msg: 'Todo not found' });
  }
});

function getNextId() {
  return nextId++;
}

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
