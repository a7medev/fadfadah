import { useEffect, useState } from 'react';

import requestRecorder from '../utils/requestRecorder';
import { useAlertMessage } from '../contexts/AlertMessageContext';

const useRecorder = () => {
  const [audioURL, setAudioURL] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    if (!recorder) {
      if (isRecording) {
        setIsRecording(false);

        requestRecorder()
          .then(recorder => {
            setHasPermission(true);
            setRecorder(recorder);
          })
          .catch(() => {
            setHasPermission(false);
            showAlertMessage('فشل الوصول إلى الميكروفون');
          });
      }
      return;
    }

    if (isRecording) {
      recorder.start();
    } else {
      if (recorder.state === 'recording') {
        recorder.stop();
      }
    }

    const handleData = (e: BlobEvent) =>
      setAudioURL(URL.createObjectURL(e.data));
    recorder.addEventListener('dataavailable', handleData);

    return () => recorder.removeEventListener('dataavailable', handleData);
  }, [recorder, isRecording, showAlertMessage]);

  const startRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
    }
  };
  const stopRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    }
  };

  return {
    audioURL,
    hasPermission,
    isRecording,
    startRecording,
    stopRecording
  };
};

export default useRecorder;
