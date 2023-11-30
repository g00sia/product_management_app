import React , {useRef, useState, useEffect} from 'react'
import { Todo } from '../model';
import "./styles.css";
import { deleteTodo, updateTodo} from '../api';

type Props ={
    todo:Todo;
    todos:Todo[];
    setTodos:React.Dispatch<React.SetStateAction<Todo[]>>;
    setButtonPopup: React.Dispatch<React.SetStateAction<boolean>>;

};
const SingleTodo = ({todo, todos, setTodos, setButtonPopup}: Props) => {
  const [edit, setEdit] = useState<boolean>(false)
  const [editTodo, setEditTodo] = useState<string>(todo.todo)
  const [editDescription, setEditDescription] = useState<string>(todo.description || '');
  const [editImageUrl, setEditImageUrl] = useState<string>(todo.image_url || '');

  const handleDelete = async () => {
    const success = await deleteTodo(todo.id);
    if (success) {
      const updatedTodos = todos.filter((item) => item.id !== todo.id);
      setTodos(updatedTodos);
    }
  };


const handleEdit = async (e:React.FormEvent, id: number)=>{
   e.preventDefault();
  const success = await updateTodo(id, editTodo,  editDescription, editImageUrl);
  if (success) {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, todo: editTodo, description: editDescription, image_url: editImageUrl } : todo))
    );
    setEdit(false);
  } else {
    // Obsługa błędu, jeśli edycja nie powiedzie się
    console.error('Error updating task.');
  }
};


const inputRef = useRef<HTMLInputElement>(null)
const descriptionRef = useRef<HTMLInputElement>(null)
const imageUrlRef = useRef<HTMLInputElement>(null)

useEffect(()=>{
  inputRef.current?.focus();
}, [edit])



return (
  <form className='todos_single' onSubmit={(e) => handleEdit(e, todo.id)}>
    {edit ? (
      <>
        <input ref={inputRef}
          value={editTodo} 
          onChange={(e) => setEditTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleEdit(e, todo.id);
            }
          }}
          className='todos_single--input' />
        <input
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleEdit(e, todo.id);
            }
          }}
          placeholder='Description'
          className='todos_single--input'
        />
        <input
          value={editImageUrl}
          onChange={(e) => setEditImageUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleEdit(e, todo.id);
            }
          }}
          placeholder='Image URL'
          className='todos_single--input'
        />
      </>
    ) : (
      <>
        <span className='todos_single--text'>{todo.todo}</span>
        <span className='todos_single--text'>{todo.description}</span>
        <span className='todos_single--text'>{todo.image_url}</span>
      </>
    )}
    <div>
      <span className='icon' onClick={() => { if (!edit) { setEdit(!edit); setEditDescription(todo.description || ''); setEditImageUrl(todo.image_url || ''); } }}>e</span>
      <span className='icon' onClick={handleDelete}>u</span>
      <span className='icon' onClick={() => setButtonPopup(true)}>c</span>
    </div>
  </form>
);
}

export default SingleTodo