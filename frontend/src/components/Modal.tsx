import React, { Children, ReactNode, useEffect, useState } from 'react'

const getChildrenByDisplayName = (children: React.ReactNode, displayName: string) => {
  const childrenArray = React.Children.toArray(children)
  return childrenArray.find((child) => {
    return (child as any).type.displayName === displayName
  })
}

export interface ModalProps {
  children?: React.ReactNode
  show?: boolean
  onHide?: () => void
  closeOnBackdropClick?: boolean
  exitButton?: boolean
}


const Modal = ({ children, show: initialShow, exitButton, onHide }: ModalProps) => {
  const modalHeader = getChildrenByDisplayName(children, 'Header')
  const modalContent = getChildrenByDisplayName(children, 'Content')
  const modalFooter = getChildrenByDisplayName(children, 'Footer')

  const [show, setShow] = useState(initialShow)

  const closeHandler = () => {
    if (onHide) {
      onHide()
    }
    setShow(false)
  }

  return (
    <div className={`${show ? 'fixed' : 'hidden'} inset-0 z-[999] bg-black bg-opacity-50 flex items-center justify-center`}>
      <div className="flex flex-col bg-white p-8 w-1/2 rounded-lg shadow-lg gap-4">
        {/* {exitButton && (
        <div className="flex justify-end">
          <button 
            className="text-2xl font-bold focus:outline-none hover:text-red-500 transition-all duration-300 ease-in-out"
            onClick={closeHandler}>x</button>
        </div>
        )} */}
        {modalHeader}
        {modalContent}
        {modalFooter}
      </div>
    </div>
  )
}

// Header component
const Header = ({ children, className = '' }: { children?: ReactNode, className?: string }) => (
  <div className={className}>{children}</div>
);
Header.displayName = 'Header';
Modal.Header = Header;

// Title component
const Title = ({ children }: { children: string }) => {
  const innerText = React.Children.toArray(children).join('');
  return <div className="h2">{innerText}</div>;
};
Title.displayName = 'Title';
Modal.Title = Title;

// Body component
const Body = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
  <div className={className}>{children}</div>
);
Body.displayName = 'Content';
Modal.Body = Body;

// Footer component
const Footer = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
  <div className={className}>{children}</div>
);
Footer.displayName = 'Footer';
Modal.Footer = Footer;
export default Modal