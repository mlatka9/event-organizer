import axios from 'axios';

const CLOUDINARY_UPLOAD_PRESET = 'uvm9hyxi';
const CLOUDINARY_UPLOAD_LINK = 'https://api.cloudinary.com/v1_1/dw6bikqwf/image/upload';

interface UploadImageType {
  url: string;
  width: number;
  height: number;
}

const uploadImage = async (
  selectedImage: File,
  uploadProgressCallback?: (progress: number) => void,
  signal?: AbortSignal
): Promise<UploadImageType> => {
  const formData = new FormData();
  formData.append('file', selectedImage);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const { data } = await axios.post(CLOUDINARY_UPLOAD_LINK, formData, {
    signal,
    onUploadProgress: (progressEvent) => {
      const percentageProgress = (progressEvent.loaded / (progressEvent.total || progressEvent.loaded)) * 100;
      if (uploadProgressCallback) {
        uploadProgressCallback(percentageProgress);
      }
    },
  });

  return {
    url: data.secure_url,
    width: data.width,
    height: data.height,
  };
};

export default uploadImage;
