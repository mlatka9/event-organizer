import { useState } from 'react';
import FormErrorMessage from './form-error-message';
import Button from '../common/button';
import CloseIcon from '../icons/close-icon';

export type FormTagPickerProps = {
  addTag: (tagName: string) => void;
  removeTag: (tagName: string) => void;
  selectedTags: string[];
};

const FormTagPicker = ({ addTag, removeTag, selectedTags }: FormTagPickerProps) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddTag = () => {
    if (inputValue.includes(' ')) {
      return;
    }
    addTag(inputValue);
    setInputValue('');
  };

  return (
    <div>
      <div className="flex space-x-5">
        <div className="relative w-full">
          <input
            className="bg-primary-100 peer block w-full appearance-none rounded-lg border-2 border-gray-300 px-2 pb-2.5 pt-4 text-sm text-gray-900  focus:border-blue-400 focus:outline-none"
            value={inputValue}
            onChange={({ target }) => {
              if (target.value.includes(' ')) {
                setErrorMessage('Tag nie może zawierać spacji');
              } else {
                setErrorMessage('');
              }
              setInputValue(target.value);
            }}
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTag();
                e.preventDefault();
              }
            }}
          />
          <label className="absolute top-5 z-10 origin-[0] -translate-y-5 scale-75 transform px-2 text-sm text-gray-500 duration-300">
            tagi
          </label>
        </div>

        <Button isSmall type="button" onClick={handleAddTag}>
          Add
        </Button>
      </div>
      <FormErrorMessage message={errorMessage} />
      <div className="mt-3 flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <div
            className="flex items-center justify-center space-x-1 rounded-full bg-blue-500 px-3 py-2 text-sm text-white"
            key={tag}
          >
            <span className="mr-1">{tag}</span>
            <button className="flex h-2 w-2 items-center justify-center text-white" onClick={() => removeTag(tag)}>
              <CloseIcon className={'fill-white'} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormTagPicker;
