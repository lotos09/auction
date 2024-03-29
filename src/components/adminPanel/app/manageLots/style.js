import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(() => ({
  gallery: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    marginTop: 20,
    '& img': {
      height: '400px',
      padding: '3px',
    },
  },

  lot: {
    borderBottom: '2px solid #ccc!important',
    padding: '10px 10px',
  },
  lotButton: {
    marginRight: 10,
  },
  inputsContainer: {
    display: 'flex',
    flexDirection: 'column',
  }
}))
