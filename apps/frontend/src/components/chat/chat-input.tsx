import Button from '../common/button';
import React from 'react';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isMessageUploading: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

const ChatInput = ({ setInputValue, inputValue, onSubmit, isMessageUploading }: ChatInputProps) => (
  <form className={'flex items-center mb-3 relative'} onSubmit={onSubmit}>
    <textarea
      rows={5}
      className={
        'p-2 pr-[90px] ring ring-blue-200 w-full min-h-[48px] max-h-[300px] focus:outline-0 focus:ring-blue-300 rounded-md'
      }
      value={inputValue}
      onChange={({ target }) => setInputValue(target.value)}
    />
    <Button isSmall disabled={isMessageUploading || !inputValue.length} className={'absolute right-2 top-2'}>
      wyślij
    </Button>
  </form>
);
export default ChatInput;
