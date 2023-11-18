import { Todo } from './model';


  const fetchData = async () => {
    try {
      const response = await fetch('/getdata');
      if (response.ok) {
        const data = await response.json();
        return data.map((item: any) => ({
          id: item.id,
          todo: item.content,
        }));
      } else {
        console.error('Error fetching data:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  const addTodo = async (todo: string): Promise<Todo | null> => {
    try {
      const response = await fetch('/getdata', {
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

  const deleteTodo = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`/delete/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        return true;
      } else {
        console.error('TUTAJ JEST BLAAAAD:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  };

  const editTodo = async (id: number, updatedTodo: string): Promise<boolean> => {
    try {
      const response = await fetch(`/edit/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: updatedTodo }),
      });
  
      if (response.ok) {
        return true;
      } else {
        console.error('Error updating task:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  };
  
  export { addTodo, deleteTodo, editTodo, fetchData};


  