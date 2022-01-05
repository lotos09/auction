import React, { useEffect, useState } from 'react';
import { myBase } from '../../../../firebase/config';
import Button from '@mui/material/Button';

import { TextField } from '@mui/material';

const db = myBase.firestore();

export const ManageContentPage = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [lot, setLot] = useState([]);
  console.log(fileUrl);
  const [previews, setPreviews] = useState([]);

  const fetchUsers = async () => {
    const usersCollection = await db.collection('users').get();
    setLot(
      usersCollection.docs.map(doc => {
        return doc.data();
      }),
    );
  };

  const onFileChange = async e => {
    const fileList = Array.from(e.target.files);

    const mappedFiles = fileList.map(file => ({
      ...file,
      preview: URL.createObjectURL(file),
    }));

    setPreviews(mappedFiles);
    //the same url can be used from code below
    const file = e.target.files[0];
    const storageRef = myBase.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    setFileUrl(await fileRef.getDownloadURL());
  };

  const onSubmit = async e => {
    e.preventDefault();
    const username = e.target.username.value;
    const description = e.target.description.value;

    if (!username || !fileUrl) {
      return;
    }
    await db.collection('users').doc(username).set({
      name: username,
      avatar: fileUrl,
      description: description,
    });

    await fetchUsers();
  };

  useEffect(async () => {
    await fetchUsers();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={onFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span">
            Upload
          </Button>
        </label>

        <TextField
          id="standard-basic"
          label="Name"
          variant="standard"
          type="text"
          name="username"
        />
        <TextField
          id="standard-basic"
          label="Description"
          variant="standard"
          type="text"
          name="description"
        />
        <button variant="contained" component="span">
          Submit
        </button>
      </form>
      {previews.map(file => (
        <img key={file.preview} width="200" src={file.preview} />
      ))}
      <div>Gallery</div>
      <div>
        {lot.map(item => {
          return (
            <div key={item.name}>
              <img width="400" src={item.avatar} alt={item.name} />
              <p>name: {item.name}</p>
              <p>description: {item?.description}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};
