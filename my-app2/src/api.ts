import { Todo } from './model';

  const addTodo = async (todo: string): Promise<Todo | null> => {
    try {
      const response = await fetch('/dupa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: todo }),
      });
  
      if (response.ok) {
        const newTodo = await response.json();
        return newTodo;
      } else {
        console.error('Error adding task:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error adding task:', error);
      return null;
    }
  };
  
  export default addTodo;

  