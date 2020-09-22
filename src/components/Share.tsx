import * as React from 'react';
import { useState, useRef } from 'react';
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { FiClipboard } from 'react-icons/fi';
import { Button, Modal, Form } from 'react-bootstrap';

export interface ShareProps {
  link: string;
  activator: React.ComponentType<any>;
}

const Share: React.FC<ShareProps> = ({ activator: Activator, link }) => {
  const [show, setShow] = useState(false);
  const linkToShare = useRef<HTMLInputElement>(null);

  function copyToClipboard() {
    linkToShare.current?.select();
    document.execCommand('copy');
  }

  return (
    <>
      <div>
        <Activator setShow={setShow} />
      </div>

      <Modal centered show={show} onHide={() => setShow(false)}>
        <Modal.Header>
          <Modal.Title>مشاركة</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4 text-center">
          <Form.Group controlId="link-to-share">
            <Form.Label>
              <h5>الرابط للمشاركة</h5>
            </Form.Label>
            <Form.Control
              ref={linkToShare}
              value={link}
              className="text-left"
              readOnly
            />
          </Form.Group>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            alignItems: 'center',
            gap: 5
          }}>
            <Button
              variant="facebook"
              href={`https://www.facebook.com/share.php?u=${link}`}
              target="_blank"
            >
              <FaFacebook size="1.1em" className="ml-2" />
              فيسبوك
            </Button>
            <Button
              variant="twitter"
              target="_blank"
              href={`https://twitter.com/intent/tweet?url=${link}`}
            >
              <FaTwitter size="1.1em" className="ml-2" />
              تويتر
            </Button>
            <Button
              variant="whatsapp"
              href={`whatsapp://send?text=${link}`}
              data-action="share/whatsapp/share"
            >
              <FaWhatsapp size="1.1em" className="ml-2" />
              واتساب
            </Button>
            <Button
              variant="dark"
              onClick={copyToClipboard}
            >
              <FiClipboard size="1.1em" className="ml-2" />
              نسخ
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="text-dark" onClick={() => setShow(false)}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Share;
