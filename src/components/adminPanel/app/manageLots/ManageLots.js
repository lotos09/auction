import React, { useContext, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { Button, TextField } from '@mui/material'
import { myBase } from '../../../../firebase/config'

import { useStyles } from './style'
import { makeCollectionPath, makeRequest } from '../../../../api/general'
import { Context } from '../../../../index'
import { useAuthState } from 'react-firebase-hooks/auth'

const ManageLots = () => {
  const [fileUrl, setFileUrl] = useState([])
  const [lots, setLots] = useState([])
  const [previews, setPreviews] = useState([])
  const classes = useStyles()
  const { auth } = useContext(Context)
  const [user] = useAuthState(auth)
  const token = user.accessToken

  console.log(fileUrl)

  const getLots = () => fetch(makeCollectionPath('lots', token, ''))
    .then(response => response.json())
    .then(data => setLots(Object.entries(data || [])))

  const deleteItem = async (id) => {
    await makeRequest(makeCollectionPath('lots', token, `/${id}`), 'DELETE')
    await getLots()
  }

  useEffect(() => {
    fetch(makeCollectionPath('lots', token, ''))
      .then(response => response.json())
      .then(data => setLots(Object.entries(data || [])))
  }, [token])

  const formik = useFormik({
    initialValues: {
      title: '',
      images: '',
      description: '',
    },
    onSubmit: async (e, { resetForm }) => {
      await makeRequest(makeCollectionPath('lots', token, ''), 'POST', { ...formik.values, images: fileUrl })

      fetch(makeCollectionPath('lots', token, ''))
        .then(response => response.json())
        .then(data => setLots(Object.entries(data || [])))

      resetForm()
      setPreviews([])
    },
  })

  console.log(formik.values)

  const onFileChange = async e => {
    formik.handleChange(e)
    const fileList = Array.from(e.target.files)

    const mappedFiles = fileList.map(file => ({
      ...file,
      preview: URL.createObjectURL(file),
    }))

    setPreviews(mappedFiles)

    const files = e.target.files
    const storageRef = myBase.storage().ref()

    for (let i = 0; i < files.length; i++) {
      const fileRef = storageRef.child('images').child(files[i].name)
      await fileRef.put(files[i])
      const imageUrl = await fileRef.getDownloadURL()
      setFileUrl(prev => [...prev, imageUrl])
    }
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
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
      </form>

      {previews.map(file => (
        <img key={file.preview} width='200' src={file.preview} />
      ))}
      <div>Gallery</div>
      <div className={classes.gallery}>
        {lots
          .map(item => {
            return (
              <div className={classes.lot} key={item[1]?.title}>
                {item[1]?.images?.map(image => {
                  return <img key={image} src={image} alt={image} />
                })}
                <p>title: {item[1]?.title}</p>
                <p>description: {item[1]?.description}</p>
                <button onClick={() => deleteItem(item[0])}>delete</button>
              </div>
            )
          })
          .reverse()}
      </div>
    </>
  )
}

export default ManageLots
