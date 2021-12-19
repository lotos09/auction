import React from 'react';
import { myBase } from '../../../../index';

export const ManageContentPage = () => {
  const onFileChange = async e => {
    const file = e.target.files[0];
    const storageRef = myBase.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
  };

  const onSubmit = e => {
    e.preventDefault();
    console.log('asd')
  };

  return (
    <>
      <form>
        <input type="file" onChange={onFileChange} />
        <input type="text" name="username" placeholder="name" />
        <input type="submit" value="Submit" onSubmit={onSubmit} />
      </form>
    </>
  );
};
