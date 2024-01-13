import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ToDoItem from './ToDoItem';

function ToDoList() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    const response = await axios.get('http://localhost:3000/todos');
    setTodos(response.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      {todos.map(todo => (
        <ToDoItem key={todo._id} todo={todo} refreshList={fetchTodos} />
      ))}
    </div>
  );
}

export default ToDoList;

