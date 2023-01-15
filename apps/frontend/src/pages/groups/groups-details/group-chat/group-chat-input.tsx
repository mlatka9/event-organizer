import React, { useState } from 'react';
import { useCreateGroupMessageMutation } from '../../../../hooks/mutation/groups';
import { ChatInput } from '../../../../components/chat';

interface ChatInputProps {
  groupId: string;
}

const GroupChatInput = ({ groupId }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const onCreateMessageSuccess = () => setInputValue('');
  const { mutate: createGroupMessage, isLoading } = useCreateGroupMessageMutation(onCreateMessageSuccess);

  const handleCreateMessage: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    createGroupMessage({
      groupId,
      content: inputValue,
    });
  };

  return (
    <ChatInput
      inputValue={inputValue}
      setInputValue={setInputValue}
      isMessageUploading={isLoading}
      onSubmit={handleCreateMessage}
    />
  );
};

export default GroupChatInput;
