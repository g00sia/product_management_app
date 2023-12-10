import React , {useRef, useState, useEffect} from 'react'
import { Product } from '../model';
import "./styles.css";
import { deleteProduct, updateProduct} from '../api';

type Props ={
    product:Product;
    products:Product[];
    setProducts:React.Dispatch<React.SetStateAction<Product[]>>;
    setButtonPopup: React.Dispatch<React.SetStateAction<boolean>>;

};
const SingleProduct = ({product: product, products: products, setProducts: setProducts, setButtonPopup}: Props) => {
  const [edit, setEdit] = useState<boolean>(false)
  const [editProduct, setEditProduct] = useState<string>(product.product)
  const [editDescription, setEditDescription] = useState<string>(product.description || '');
  const [editImageUrl, setEditImageUrl] = useState<string>(product.image_url || '');

  const handleDelete = async () => {
    const success = await deleteProduct(product.id);
    if (success) {
      const updatedTodos = products.filter((item) => item.id !== product.id);
      setProducts(updatedTodos);
    }
  };


const handleEdit = async (e:React.FormEvent, id: number)=>{
   e.preventDefault();
  const success = await updateProduct(id, editProduct,  editDescription, editImageUrl);
  if (success) {
    setProducts(
      products.map((product) => (product.id === id ? { ...product, product: editProduct, description: editDescription, image_url: editImageUrl } : product))
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
  <form className='todos_single' onSubmit={(e) => handleEdit(e, product.id)}>
    {edit ? (
      <>
        <input ref={inputRef}
          value={editProduct} 
          onChange={(e) => setEditProduct(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleEdit(e, product.id);
            }
          }}
          className='todos_single--input' />
        <input
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleEdit(e, product.id);
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
              handleEdit(e, product.id);
            }
          }}
          placeholder='Image URL'
          className='todos_single--input'
        />
      </>
    ) : (
      <>
        <span className='todos_single--text'>{product.product}</span>
        <span className='todos_single--text'>{product.description}</span>
        <span className='todos_single--text'>{product.image_url}</span>
      </>
    )}
    <div>
      <span className='icon' onClick={() => { if (!edit) { setEdit(!edit); setEditDescription(product.description || ''); setEditImageUrl(product.image_url || ''); } }}>e</span>
      <span className='icon' onClick={handleDelete}>u</span>
      <span className='icon' onClick={() => setButtonPopup(true)}>c</span>
    </div>
  </form>
);
}

export default SingleProduct