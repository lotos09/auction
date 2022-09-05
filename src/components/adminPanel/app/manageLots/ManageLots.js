import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { Button, TextField } from '@mui/material';

import { useStyles } from './style';
import { makeCollectionPath, makeRequest } from '../../../../api/general';
import { Context } from '../../../../App';
import { useAuthState } from 'react-firebase-hooks/auth';

const styles = {
  previewContainer: {
    margin: '20px 0',
  },
  previewImg: {
    border: 'solid 1px black',
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    margin: '10px',
    borderRadius: '5px',
  },
  form: {
    display: 'flex',
    justifyContent: 'space-between',
    width: 600,
  }
};


const ManageLots = () => {
  const [fileUrl, setFileUrl] = useState([]);
  const [lots, setLots] = useState([]);
  const [previews, setPreviews] = useState([]);
  const classes = useStyles();
  const {
    auth,
    myBase,
    isAdmin,
    isEmployee,
  } = useContext(Context);

  const isManageAllowed = useMemo(() => isAdmin || isEmployee, [isAdmin, isEmployee]);

  const [user] = useAuthState(auth);
  const token = user.accessToken;


  const getLots = () => fetch(makeCollectionPath('lots', token, ''))
    .then(response => response.json())
    .then(data => setLots(Object.entries(data || [])));

  const deleteItem = async (id) => {
    await makeRequest(makeCollectionPath('lots', token, `/${id}`), 'DELETE');
    await getLots();
  };

  useEffect(() => {
    fetch(makeCollectionPath('lots', token, ''))
      .then(response => response.json())
      .then(data => setLots(Object.entries(data || [])));
  }, [token]);

  const formik = useFormik({
    initialValues: {
      title: '',
      images: '',
      description: '',
    },
    onSubmit: async (e, { resetForm }) => {
      await makeRequest(makeCollectionPath('lots', token, ''),
        'POST', { ...formik.values, images: fileUrl });

      fetch(makeCollectionPath('lots', token, ''))
        .then(response => response.json())
        .then(data => setLots(Object.entries(data || [])));

      resetForm();
      setPreviews([]);
    },
  });

  const onFileChange = async e => {
    formik.handleChange(e);
    const fileList = Array.from(e.target.files);

    const mappedFiles = fileList.map(file => ({
      ...file,
      preview: URL.createObjectURL(file),
    }));

    setPreviews(mappedFiles);

    const files = e.target.files;
    const storageRef = myBase.storage().ref();

    for (let i = 0; i < files.length; i++) {
      const fileRef = storageRef.child('images').child(files[i].name);
      await fileRef.put(files[i]);
      const imageUrl = await fileRef.getDownloadURL();
      setFileUrl(prev => [...prev, imageUrl]);
    }
  };

  return (
    <>
      {isManageAllowed &&
        <form style={styles.form} onSubmit={formik.handleSubmit}>
          <input
            accept='image/*'
            style={{ display: 'none' }}
            id='images'
            multiple
            name='images'
            type='file'
            onChange={onFileChange}
            value={formik.values.images}
          />
          <label htmlFor='images'>
            <Button variant='contained' component='span'>
              Upload
            </Button>
          </label>

          <TextField
            required
            id='title'
            name='title'
            label='title'
            type='text'
            onChange={formik.handleChange}
            value={formik.values.title}
          />

          <TextField
            required
            id='desc'
            label='description'
            name='description'
            onChange={formik.handleChange}
            value={formik.values.description}
          />

          <Button type='submit'>Submit</Button>
      </form>}

      <div style={styles.previewContainer}>
        {previews.map(file => (
          <img style={styles.previewImg} key={file.preview} width='200' src={file.preview} alt="lot image" />
        ))}
      </div>

      <div>Gallery</div>
      <div className={classes.gallery}>
        {lots
          .map((item, index) => {
            return (
              <div className={classes.lot} key={index}>
                {item[1]?.images?.map(image => {
                  return <img style={styles.previewImg} key={image} src={image} alt={image} />;
                })}
                <p>title: {item[1]?.title}</p>
                <p>description: {item[1]?.description}</p>
                {isManageAllowed && <Button variant='contained' onClick={() =>
                  deleteItem(item[0])}>delete</Button>}
              </div>
            );
          })
          .reverse()}
      </div>
    </>
  );
};

export default ManageLots;
