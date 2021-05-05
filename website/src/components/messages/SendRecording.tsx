import { useState } from 'react';
import { Alert, Badge, Button, Modal } from 'react-bootstrap';

import AudioPlayer from '../audio/AudioPlayer';
import RecordButton from './RecordButton';
import useRecorder from '../../hooks/useRecorder';

export interface SendRecordingProps {
  onSend: (url: string) => void;
}

const SendRecording: React.FC<SendRecordingProps> = ({ onSend }) => {
  const {
    audioURL,
    isRecording,
    startRecording,
    stopRecording
  } = useRecorder();
  const [showModal, setShowModal] = useState(false);

  const handleStop = () => {
    stopRecording();
    setShowModal(true);
  };

  const handleSend = () => {
    setShowModal(false);
    onSend(audioURL);
  };

  return (
    <>
      <RecordButton
        onRecord={startRecording}
        onStop={handleStop}
        recording={isRecording}
      />

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>
            إرسال تسجيل صوتي
            <Badge variant="warning">تجريبي</Badge>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <p>هل تود إرسال هذا التسجيل الصوتي؟</p>

          <Alert variant="primary">
            يتم تغيير نبرة الصوت عند الإرسال حتى لا يتعرف المستلم على هوية
            المرسل
          </Alert>

          <div
            className="my-3 mx-auto rounded-pill shadow-sm p-2 pr-3"
            style={{ maxWidth: 350 }}
          >
            <AudioPlayer url={audioURL} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSend}>
            إرسال
          </Button>
          <Button variant="outline-dark" onClick={() => setShowModal(false)}>
            إلغاء
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SendRecording;
