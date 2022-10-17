import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { Button, TextField } from '@mui/material';

import { useStyles } from './style';
import { makeCollectionPath, makeRequest } from '../../../../api/general';
import { Context } from '../../../../App';
import { useAuthState } from 'react-firebase-hooks/auth';

//use useStyles and separate file to get rid of inline styles
const styles = {
  previewContainer: {
    margin: '20px 0',
    display: 'flex',
  },
  previewCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  previewDeleteButton: {
    marginLeft: 10,
    width: 200,
  },
  previewImg: {
    border: 'solid 1px black',
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    margin: '10px',
    borderRadius: '5px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: 600,
  }
};


const ManageLots = () => {
  const [fileUrl, setFileUrl] = useState([]);
  const [lots, setLots] = useState([]);

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

  const onDeleteItem = async (id) => {
    await makeRequest(makeCollectionPath('lots', token, `/${id}`), 'DELETE');
    await getLots();
  };

  const onEditItem = async (id) => {
    await makeRequest(makeCollectionPath('lots', token, `/${id}`), 'PATCH', {title: 'testTitle'});
    await getLots();
  }

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

      await getLots();

      setFileUrl([]);
      resetForm();
      setPreviews([]);
    },
  });

  const onFileChange = async e => {
    formik.handleChange(e);

    const files = e.target.files;
    const storageRef = myBase.storage().ref();

    for (let i = 0; i < files.length; i++) {
      const fileRef = storageRef.child('images').child(files[i].name);
      await fileRef.put(files[i]);
      const imageUrl = await fileRef.getDownloadURL();
      setFileUrl(prev => [...prev, imageUrl]);
    }
  };

  const onDeletePreview = useCallback((url) => {
    setFileUrl(prev => prev.filter(item => item !== url));
  }, []);

  return (
    <>
      <div>
        <h3>Add new lot Item:</h3>
        <div>
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

              <div className={classes.inputsContainer}>
                <TextField
                  required
                  id='title'
                  name='title'
                  label='title'
                  type='text'
                  onChange={formik.handleChange}
                  value={formik.values.title}
                  style={{
                    marginTop: 8,
                  }}
                />

                <TextField
                  required
                  id='desc'
                  label='description'
                  name='description'
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  style={{
                    height: 200,
                    marginTop: 8,
                  }}
                />
              </div>


              <Button style={{alignSelf: 'flex-start'}} type='submit'>Submit</Button>
            </form>}
        </div>
      </div>

      {/*<div style={styles.previewContainer}>*/}
      {/*  {previews.map((file) => {*/}

      {/*    return (<div key={file.preview} style={styles.previewCard}>*/}
      {/*      <img style={styles.previewImg} height='200' src={file.preview} alt="lot image" />*/}
      {/*      <Button onClick={() => onDeletePreview(file.key)} variant='contained' style={styles.previewDeleteButton}>remove</Button>*/}
      {/*    </div>*/}
      {/*  )})}*/}
      {/*</div>*/}

      <div style={styles.previewContainer}>
        {fileUrl.map((url, index) => {

          return (<div key={index} style={styles.previewCard}>
              <img style={styles.previewImg} height='200' src={url} alt="lot image" />
              <Button onClick={() => onDeletePreview(url)} variant='contained' style={styles.previewDeleteButton}>remove</Button>
            </div>
          )})}
      </div>

      <h3>Lots list:</h3>
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
                {isManageAllowed &&
                  <div>
                    <Button className={classes.lotButton} variant='contained' onClick={() => onDeleteItem(item[0])}>delete</Button>
                    <Button variant='contained' onClick={() => onEditItem(item[0])}>edit</Button>
                  </div>}
              </div>
            );
          })
          .reverse()}
      </div>
    </>
  );
};

export default ManageLots;
