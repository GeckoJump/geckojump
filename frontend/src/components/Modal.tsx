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
    <div className={`${show ? 'fixed' : 'hidden'} top-0 left-0 w-full h-full z-[999] bg-black bg-opacity-50 flex items-center justify-center`}>
      <div className="flex flex-col bg-white p-8 w-1/2 rounded-lg shadow-lg gap-4">
        {exitButton && (
        <div className="flex justify-end">
          <button 
            className="text-2xl font-bold focus:outline-none hover:text-red-500 transition-all duration-300 ease-in-out"
            onClick={closeHandler}>X</button>
        </div>
        )}
        {modalHeader}
        {modalContent}
        {modalFooter}
      </div>
    </div>
  )
}

const Header = ({ children, className: additionalClasses }: { children?: ReactNode, className?: string }) => {
  return <div
    className={`${additionalClasses}`}
  >{children}</div>
}

const Title = ({ children }: { children: string }) => {
  const innerText = React.Children.toArray(children).join('')
  return <div className="h2">{innerText}</div>
}
Modal.Title = Title

Header.displayName = 'Header'

const Body = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>
}
Body.displayName = 'Content'
Modal.Body = Body

const Footer = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>
}
Footer.displayName = 'Footer'

Modal.Header = Header
Modal.Footer = Footer

export default Modal