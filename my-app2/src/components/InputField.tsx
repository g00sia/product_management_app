import React, { useRef } from 'react'
import "./styles.css"
import { FaThumbsUp } from "react-icons/fa";

interface Props {
  product: string;
  description: string;
  imageUrl: string;
  setProduct: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  handleAdd:(e: React.FormEvent) => void;
}

const InputField = ({product: product, description, imageUrl, setProduct: setProduct, setDescription, setImageUrl, handleAdd }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <form className="input" onSubmit={(e)=>{
      handleAdd(e)
      inputRef.current?.blur()}}>
      <input
        ref = {inputRef}
        type='input'
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        placeholder='enter a product'
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
      <button className='input_submit' type='submit'><FaThumbsUp /></button>
    </form>
  );
};

export default InputField;