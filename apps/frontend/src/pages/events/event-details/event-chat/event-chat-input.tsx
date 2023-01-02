import React, { useState } from 'react';
import { useCreateGroupMessageMutation } from '../../../../hooks/mutation/groups';
import { ChatInput } from '../../../../components/chat';
import { useCreateEventChatMessageMutation } from '../../../../hooks/mutation/events';

interface ChatInputProps {
  eventId: string;
}

const EventChatInput = ({ eventId }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const onCreateMessageSuccess = () => setInputValue('');

  const { mutate: createEventChatMessage, isLoading } = useCreateEventChatMessageMutation(onCreateMessageSuccess);

  const handleCreateMessage: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    createEventChatMessage({
      eventId,
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

export default EventChatInput;
