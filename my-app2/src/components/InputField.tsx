import React, { useRef } from 'react'
import "./styles.css"

interface Props {
  todo: string;
  description: string;
  imageUrl: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  handleAdd:(e: React.FormEvent) => void;
}

const InputField = ({todo, description, imageUrl, setTodo, setDescription, setImageUrl, handleAdd }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <form className="input" onSubmit={(e)=>{
      handleAdd(e)
      inputRef.current?.blur()}}>
      <input
        ref = {inputRef}
        type='input'
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        placeholder='enter a task'
        className="input_box"
      />
       <input
        type='input'  
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder='enter a description'
        className="input_box"
      />
      <input
        type='input' 
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder='enter an image URL'
        className="input_box"
      />
      <button className='input_submit' type='submit'>Go</button>
    </form>
  );
};

export default InputField;