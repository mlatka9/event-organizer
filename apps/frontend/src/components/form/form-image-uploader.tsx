import CloseIcon from '../icons/close-icon';
import { useEffect, useMemo, useRef, useState } from 'react';
import PhotoIcon from '../icons/photo-icon';
import uploadImage from '../../libs/cloudinary';

interface FormImageUploaderProps {
  addImage: (tagName: string) => void;
  removeImage: () => void;
  selectedImage: string | null;
}

const FormImageUploader = ({ removeImage, selectedImage, addImage }: FormImageUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!selectedFile) return;
    const abortController = new AbortController();
    const { signal } = abortController;

    uploadImage(selectedFile, (p) => setUploadProgress(p), signal)
      .then((image) => {
        console.log('image.url', image.url);
        addImage(image.url);
      })
      .catch((e) => {
        if (!signal?.aborted) {
          console.error(e);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [selectedFile]);

  // const tempImage = useMemo(() => selectedFile?.name && URL.createObjectURL(selectedFile), [selectedFile?.name]);

  console.log('selectedImage', selectedImage);

  return (
    <div>
      <div className="flex space-x-5">
        <div className="overflow-hidden flex flex-col bg-white min-h-[50px] relative w-full bg-primary-100 peer block w-full appearance-none rounded-lg border-2 border-gray-300 text-sm text-gray-900  focus:border-blue-400 focus:outline-none">
          <input
            ref={fileInputRef}
            className={'hidden'}
            onChange={({ target }) => {
              setSelectedFile(target.files?.[0]);
            }}
            type="file"
            id={'file'}
            accept="image/*"
          />
          <label htmlFor={'file'} className={'h-12 w-full cursor-pointer block relative'}>
            <span className="absolute top-5 z-10 origin-[0] -translate-y-5 scale-75 transform px-2 text-sm text-gray-500 duration-300">
              dodaj obrazek
            </span>
            <p className={'mt-5 ml-2'}>{selectedFile?.name}</p>
            <PhotoIcon className={'absolute right-3 top-1/2 -translate-y-1/2 fill-gray-400'} />
          </label>
          <div
            className={'w-full h-[6px] bg-blue-800/70 absolute bottom-0 transition-transform'}
            style={{ transform: `translateX(-${100 - uploadProgress}%)` }}
          />
          {selectedImage && (
            <div className={'relative'}>
              <button
                type={'button'}
                className={
                  'absolute top-3 right-3 bg-neutral-800/80 rounded-full w-6 h-6 flex items-center justify-center z-10'
                }
                onClick={() => {
                  removeImage();
                  setSelectedFile(undefined);
                  if (fileInputRef.current && fileInputRef.current?.value) {
                    fileInputRef.current.value = '';
                  }
                  setUploadProgress(0);
                }}
              >
                <CloseIcon className={'fill-white'} />
              </button>
              <img src={selectedImage} className={'w-full h-[200px] object-cover'} />
            </div>
          )}
        </div>
      </div>
      {/*<FormErrorMessage message={errorMessage} />*/}
    </div>
  );
};

export default FormImageUploader;
