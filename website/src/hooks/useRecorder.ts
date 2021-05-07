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

  const forceStartRcording = (recorder: MediaRecorder) => {
    recorder.start();
    recorder.addEventListener('dataavailable', e => handleAudioData(e));
    setIsRecording(true);
  };

  const startRecording = useCallback(async () => {
    if (recorder) {
      return forceStartRcording(recorder);
    }

    try {
      const supportsPermissions = 'permissions' in navigator;
      const { state: permissionState } = supportsPermissions
        ? await navigator.permissions.query({
            name: 'microphone'
          })
        : { state: 'unknown' };

      requestRecorder().then(recorder => {
        setRecorder(recorder);

        if (permissionState === 'granted') {
          forceStartRcording(recorder);
        }
      });
    } catch (err) {
      showAlertMessage('فشل الوصول إلى الميكروفون');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorder]);

  const stopRecording = async () => {
    if (recorder?.state === 'recording') {
      recorder.stop();
      setIsRecording(false);
      recorder.removeEventListener('dataavailable', handleAudioData);
      return true;
    }
    return false;
  };

  return {
    audioURL,
    isRecording,
    startRecording,
    stopRecording
  };
};

export default useRecorder;
