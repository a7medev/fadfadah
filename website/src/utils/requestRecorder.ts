const requestRecorder = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return new MediaRecorder(stream, { mimeType: 'audio/webm' });
};

export default requestRecorder;
