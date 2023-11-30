import { Todo } from './model';


  const fetchData = async (page: number = 1, pageSize: number = 5) => {
    try {
      const response = await fetch(`/getdata?page=${page}&pageSize=${pageSize}`);
      if (response.ok) {
        const data = await response.json();
        return data.map((item: any) => ({
          id: item.id,
          todo: item.content,
          description: item.description,  
          image_url: item.image_url 
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

  const getTotalPages = async (pageSize: number): Promise<number> => {
    try {
      const response = await fetch(`/getTotalPages?pageSize=${pageSize}`);
      if (response.ok) {
        const data = await response.json();
        return data.totalPages;
      } else {
        console.error('Error fetching total pages:', response.statusText);
        return 0;
      }
    } catch (error) {
      console.error('Error fetching total pages:', error);
      return 0;
    }
  };

  const addTodo = async (todo: string, description: string, imageUrl: string ): Promise<Todo | null> => {
    try {
      const response = await fetch('/getdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: todo, description, image_url: imageUrl })
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

  const updateTodo = async (id: number, updatedTodo: string, updatedDescription: string, updatedImageUrl: string): Promise<boolean> => {
    console.log("DUPA");
    try {
      const response = await fetch(`/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: updatedTodo, description: updatedDescription,
          image_url: updatedImageUrl}),
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


  const searchTodo = async (searchTerm: string, page: number = 1, pageSize: number = 5): Promise<Todo[]> => {
    try {
      const response = await fetch(`/search?q=${searchTerm}&page=${page}&pageSize=${pageSize}`);
      if (response.ok) {
        const data = await response.json();
        return data.results.map((item: any) => ({
          id: item.id,
          todo: item.content,
          description: item.description,  
          image_url: item.image_url 
        }));
      } else {
        console.error('Error searching todo:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error searching todo:', error);
      return [];
    }
  };
  
  export { addTodo, deleteTodo, updateTodo, fetchData, getTotalPages, searchTodo};


  