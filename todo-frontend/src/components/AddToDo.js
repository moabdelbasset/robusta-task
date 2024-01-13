import React, { useState } from 'react';
import axios from 'axios';

function AddToDo() {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    await axios.post('http://localhost:3000/todos', { title });
    setTitle('');
    // Refresh the list or emit an event to notify ToDoList
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Add new todo" 
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddToDo;

