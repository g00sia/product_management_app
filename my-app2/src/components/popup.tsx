
import React, { useEffect, useState } from 'react';
import { Product, Comment } from '../model';
import { getCommentsForProduct, updateComment, deleteComment } from '../api';
import { MdEdit } from "react-icons/md";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { BsFillChatRightHeartFill } from "react-icons/bs";


interface PopupProps {
  trigger: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: Product | null;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  handleAddComment: () => Promise<void>;  // Zakładam, że handleAddComment zwraca Promise<void>
  children?: React.ReactNode;  // Dodaj children do interfejsu
}
const Popup: React.FC<PopupProps> = ({
  trigger,
  setTrigger,
  selectedProduct,
  newComment,
  setNewComment,
  handleAddComment,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState<string>('');
  const [edit, setEdit] = useState<boolean>(false)


  useEffect(() => {
    // Pobierz komentarze po otwarciu Popup
    if (selectedProduct) {
      fetchComments(selectedProduct.id);
    }
  }, [selectedProduct]);

  const fetchComments = async (productId: number) => {
    try {
      const commentsData = await getCommentsForProduct(productId);
      setComments(commentsData);
      
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleEditComment = async (commentId: number) => {
    try {
      await updateComment(commentId, editCommentContent);
      fetchComments(selectedProduct?.id || 0);
      setEditCommentId(null);
      setEditCommentContent('');
      setEdit(false);
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

//   const handleEditComment1 = async (e:React.FormEvent, commentId: number)=>{
//     e.preventDefault();
//    const success = await updateComment(commentId, editCommentContent);
//    if (success) {
//      setProducts(
//        selectedProduct.map((product) => (product.id === id ? { ...product, comment:editCommentContent} : product))
//      );
//      setEdit(false);
//    } else {
//      // Obsługa błędu, jeśli edycja nie powiedzie się
//      console.error('Error updating task.');
//    }
//  };
 


  const handleDeleteComment = async (commentId: number) => {
    try {
      // Wysyłanie żądania do usunięcia komentarza na backend
      await deleteComment(commentId);

      // Odświeżanie listy komentarzy po usunięciu
      fetchComments(selectedProduct?.id || 0);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };


  return trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={() => setTrigger(false)}>
          &times;
        </button>
        <h3>Komentarze</h3>
       
        {selectedProduct && (
          <>
            <h3>{selectedProduct.product}</h3>
            <br />
             <form>
              <input
                className="searchbar"
                type="text"
                placeholder="Nowy komentarz"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className = "searchbutton" type="button" onClick={handleAddComment}>
                Dodaj komentarz
              </button>
            </form>
            
            <ul>
            {comments.map((comment) => (
  <li key={comment.id}>
    {editCommentId === comment.id ? (
      // Jeśli edytujemy ten komentarz, pokaż pole do edycji
      <div>
        <input
          type="text"
          value={editCommentContent}
          onChange={(e) => setEditCommentContent(e.target.value)}
        />
        <button onClick={() => handleEditComment(comment.id)}>Zapisz</button>
      </div>
    ) : (
      // Jeśli nie edytujemy, pokaż treść komentarza
      <>
        {comment.content}
        <span className='icon' onClick={() => setEditCommentId(comment.id)}>
          <MdEdit />
        </span>
        <span className='icon' onClick={() => handleDeleteComment(comment.id)}>
          <RiDeleteBin7Fill />
        </span>
      </>
    )}
  </li>
))}
            </ul>
            
          </>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Popup;


