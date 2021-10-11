const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if(!user) {
    return response.status(400).json({ error: "User not found!" });
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const { name , username } = request.body;

  const userExists = users.some((user) => user.username = username)

  if(userExists) {
    return response.status(400).json({ error: "User already exists!" })
  }

  const userData = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };

  users.push(userData);

  return response.status(201).json(userData);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todoData = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(todoData);

  return response.status(201).json(todoData);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  const todos = user.todos.map((todo) => {
    if(todo.id === id) {
      todo.title = title;
      todo.deadline = new Date(deadline);
      return todo
    } else {
      return todo
    }
  })

  user.todos = todos;

  return response.status(201).send();

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todos = user.todos.map((todo) => {
    if(todo.id === id) {
      todo.done = true
      return todo
    } else {
      return todo
    }
  })

  user.todos = todos;

  return response.status(201).send();
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todos = user.todos.filter((todo) => todo.id !== id);

  user.todos = todos;

  return response.status(201).send();

});

module.exports = app;