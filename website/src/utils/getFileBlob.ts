import axios from 'axios';

const getBlobFile = async (blobURL: string): Promise<Blob> => {
  const { data } = await axios.get(blobURL, { responseType: 'blob' });
  return data;
};

export default getBlobFile;
