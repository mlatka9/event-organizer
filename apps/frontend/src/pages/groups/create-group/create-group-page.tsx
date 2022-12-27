import React from 'react';
import GroupForm from './group-form';
import useGroupForm from './use-group-form';
import useCreateGroup from './use-create-group';

const CreateGroupPage = () => {
  const { register, handleSubmit, errors, handleSetError } = useGroupForm();
  const { onSubmit, isLoading } = useCreateGroup({ setError: handleSetError });

  return (
    <div className={'pt-10 w-full w-[1000px]'}>
      <GroupForm />
    </div>
  );
};

export default CreateGroupPage;
