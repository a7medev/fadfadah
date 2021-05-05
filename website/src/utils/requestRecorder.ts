const requestRecorder = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return new MediaRecorder(stream);
};

export default requestRecorder;
