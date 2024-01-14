import React from 'react'
import "./styles.css"
import { Product } from '../model';
import SingleProduct from './SingleTodo';

interface Props{
    products:Product[];
    setProducts:React.Dispatch<React.SetStateAction<Product[]>>;
    setButtonPopup: React.Dispatch<React.SetStateAction<boolean>>;
    handleCommentIconClick: (product: Product) => void;
}

const Productlist: React.FC<Props> =  ({ products, setProducts, setButtonPopup, handleCommentIconClick })=> {
  return (
    <div className="todos">
        {products.map(product=>(
            <SingleProduct
            product = {product} 
            key={product.id}
            products = {products}
            setProducts = {setProducts}
            setButtonPopup={setButtonPopup}
            handleCommentIconClick={() => handleCommentIconClick(product)}
            />   
        ))}
    </div>
  )
};

export default Productlist