import React from 'react'

interface PopupProps {
    children: React.ReactNode;
    trigger?: boolean;
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  const Popup: React.FC<PopupProps> = (props) => {
    return (props.trigger)?(
      <div className="popup">
        <div className="popup-inner">
          <button className="close-btn" onClick={()=>props.setTrigger(false)}>close</button>
          {props.children}
        </div>
      </div>
    ):null;
  };
  
  export default Popup;