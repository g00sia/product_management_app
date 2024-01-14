import React, { useEffect, useState } from 'react';
import './App.css';
import InputField from './components/InputField';
import { Product } from './model';
import Productlist from './components/Todolist';
import {addProduct, fetchData, getTotalPages, addCommentToProduct} from './api';
import Popup from './components/popup';
import SearchBar from './components/SearchBar'
import { BsClipboardHeart } from "react-icons/bs";

const App: React.FC = () => {
  const [product, setProduct] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [description, setDescription] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [totalPages, setTotalPages] = useState(3);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newComment, setNewComment] = useState<string>('');


 
  useEffect(() => {
    const fetchAndSetData = async (page: number, pageSize: number) => {
      const data = await fetchData(page, pageSize); 
      setProducts(data);
      const totalPages = await getTotalPages(pageSize);
      setTotalPages(totalPages)
    }; fetchAndSetData(page, pageSize);
  }, [page, pageSize]);


   
 const handleAdd = async (e: React.FormEvent) => {
  e.preventDefault();
  if (product) {
    const newProduct = await addProduct(product, description, imageUrl);
    if (newProduct) {
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setProduct("");
      setDescription("");
      setImageUrl("");
      window.location.reload();
    }
  }
};

const handlePageChange = (newPage: number) => {
  setPage(newPage);
};

const renderPaginationButtons = () => {
  const buttons = [];
  for (let i = 1; i <= totalPages; i++) {
    buttons.push(
      <input
        key={i}
        id={`dot-${i}`}
        type="radio"
        name="dots"
        checked={page === i}
        onChange={() => handlePageChange(i)}
      />
    );
  }
  return buttons;
};

const handleCommentIconClick = (product: Product) => {
  setSelectedProduct(product);
  setButtonPopup(true);
};


const handleAddComment = async () => {
  try {
    if (selectedProduct && newComment) {
      const updatedProduct = await addCommentToProduct(selectedProduct.id, newComment);

      if (updatedProduct) {
        // Zaktualizuj stan produktu po dodaniu komentarza
        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );

        // Zamknij popup po dodaniu komentarza
        setButtonPopup(false);
      }
    }
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};



  return (
    <div className="App">
      <span className="heading">Thingyfy <BsClipboardHeart /></span>
      <InputField product={product}description={description}
        imageUrl={imageUrl}
        setProduct={setProduct}
        setDescription={setDescription}
        setImageUrl={setImageUrl}
        handleAdd={handleAdd} />
      <div className="pagination">{renderPaginationButtons()}</div>
      <Productlist products={showSearchResults ? searchResults : products} setProducts={setProducts} setButtonPopup={setButtonPopup} handleCommentIconClick={handleCommentIconClick}/>
      <SearchBar setShowSearchResults={setShowSearchResults} setSearchResults={setSearchResults}/>
      <Popup trigger={buttonPopup}
        setTrigger={setButtonPopup}
        selectedProduct={selectedProduct}
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
      >
      </Popup>

    </div>
  );
};

export default App;