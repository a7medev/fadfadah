import * as React from 'react';
import { createPortal } from 'react-dom';
import { Modal, Button } from 'react-bootstrap';
import './MessageBox.scss';

export interface MessageBoxProps {
  title: string;
  text: string;
  show: boolean;
  onClose: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ title, text, show, onClose }) => {
  return createPortal(
    <div className={'modal-content message-box ' + (show ? 'show' : '')}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-4 text-center">{text}</Modal.Body>
      <Modal.Footer>
        <Button variant="text-dark" size="sm" onClick={onClose}>إغلاق</Button>
      </Modal.Footer>
    </div>,
    document.getElementById('message')!
  );
};

export default MessageBox;
