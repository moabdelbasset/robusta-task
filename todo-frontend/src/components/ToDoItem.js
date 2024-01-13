import React from 'react';
import axios from 'axios';

function ToDoItem({ todo, refreshList }) {
  const handleDelete = async () => {
    await axios.delete(`http://localhost:3000/todos/${todo._id}`);
    refreshList(); // Refresh the list after deletion
  };

  return (
    <div>
      {todo.title}
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default ToDoItem;

