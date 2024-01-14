// components/Popup.tsx

import React from 'react';
import { Product } from '../model';


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



  return trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={() => setTrigger(false)}>
          &times;
        </button>
        <h3>Komentarze</h3>
        <form>
              <input
                type="text"
                placeholder="Nowy komentarz"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="button" onClick={handleAddComment}>
                Dodaj komentarz
              </button>
            </form>
        {selectedProduct && (
          <>
            <h3>{selectedProduct.product}</h3>
            <br />
            <ul>
              {selectedProduct.comments?.map(comment => (
                <li key={comment.id}>{comment.content}</li>
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
