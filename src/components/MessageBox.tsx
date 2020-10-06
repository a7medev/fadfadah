import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal, Button } from 'react-bootstrap';
import './MessageBox.scss';

export interface MessageBoxProps {
  title: string;
  text: string;
  show: boolean;
  hideAfter?: number;
  onClose: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  title,
  text,
  show,
  hideAfter = 5000,
  onClose
}) => {
  const [showBox, setShowBox] = useState<boolean>(false);

  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setShowBox(show);

    if (show) {
      timeout.current = setTimeout(() => {
        setShowBox(false);
      }, hideAfter);
    } else if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = undefined;
    }
  }, [show, hideAfter]);

  return createPortal(
    <div className={'modal-content message-box ' + (showBox ? 'show' : '')}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-4 text-center">{text}</Modal.Body>
      <Modal.Footer>
        <Button variant="text-dark" size="sm" onClick={onClose}>
          إغلاق
        </Button>
      </Modal.Footer>
    </div>,
    document.getElementById('message')!
  );
};

export default MessageBox;
