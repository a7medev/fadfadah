import { useState, useCallback } from 'react';

import requestRecorder from '../utils/requestRecorder';
import { useAlertMessage } from '../contexts/AlertMessageContext';

const useRecorder = () => {
  const [audioURL, setAudioURL] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const { showAlertMessage } = useAlertMessage();

  const handleAudioData = useCallback((e: BlobEvent) => {
    setAudioURL(URL.createObjectURL(e.data));
  }, []);

  const forceStartRcording = useCallback(() => {
    recorder?.start();
    setIsRecording(true);
    recorder?.addEventListener('dataavailable', handleAudioData);
  }, [recorder, handleAudioData]);

  const startRecording = useCallback(async () => {
    if (recorder) {
      return forceStartRcording();
    }

    try {
      const recorder = await requestRecorder();
      setRecorder(recorder);
      forceStartRcording();
    } catch (err) {
      showAlertMessage('فشل الوصول إلى الميكروفون');
    }
  }, [recorder, forceStartRcording, showAlertMessage]);

  const stopRecording = useCallback(async () => {
    if (recorder?.state === 'recording') {
      recorder.stop();
      setIsRecording(false);
      recorder.removeEventListener('dataavailable', handleAudioData);
    }
  }, [recorder, handleAudioData]);

  return {
    audioURL,
    isRecording,
    startRecording,
    stopRecording
  };
};

export default useRecorder;
