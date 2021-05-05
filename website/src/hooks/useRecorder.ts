import { useEffect, useState } from 'react';

import requestRecorder from '../utils/requestRecorder';
import { useAlertMessage } from '../contexts/AlertMessageContext';

const useRecorder = () => {
  const [audioURL, setAudioURL] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    if (!recorder) {
      if (isRecording) {
        requestRecorder()
          .then(setRecorder)
          .catch(() => showAlertMessage('فشل الوصول إلى الميكروفون'));
      }
      return;
    }

    if (isRecording) {
      recorder.start();
    } else {
      recorder.stop();
    }

    const handleData = (e: BlobEvent) => setAudioURL(URL.createObjectURL(e.data));
    recorder.addEventListener('dataavailable', handleData);

    return () => recorder.removeEventListener('dataavailable', handleData);
  }, [recorder, isRecording, showAlertMessage]);

  const startRecording = () => setIsRecording(true);
  const stopRecording = () => setIsRecording(false);

  return { audioURL, isRecording, startRecording, stopRecording };
};

export default useRecorder;
