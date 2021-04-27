import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import {
  Switch, FormGroup, FormControlLabel, Typography, SwipeableDrawer, Button,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import useStyles from '../styles';
import { StoreContext } from '../store';

function rand() {
  return 0;
  // return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const drawerWidth = 240;

export default function LoginLayout({ children }) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const history = useHistory();

  const [modalStyle] = React.useState(getModalStyle);

  const { darkModeState, toggleDarkMode } = React.useContext(StoreContext);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const modalComp = (
    <FormControlLabel
      value='start'
          // control={<Switch color='primary' />}
      label='Toggle Dark Mode'
      labelPlacement='start'
      control={(
        <Switch checked={darkModeState} onClick={() => toggleDarkMode(darkModeState)} label={'Toggle Dark Mode'} />
          )}
    />
  );

  const body = (
    <div
      style={{
        ...modalStyle,
        position: 'absolute',
        width: 300,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: 25,
      }}
    >
      {modalComp}

    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position='fixed'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={() => history.goBack()}
            edge='start'
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography component='h1' variant='h5' noWrap className={classes.title}>
            Moving Lines
          </Typography>
          <Button className={classes.loginButton} onClick={() => history.push('/login')} color='inherit'>
            Login
          </Button>
          <Button className={classes.loginButton} onClick={() => history.push('/signup')} color='inherit'>
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {body}
      </Modal>
    </div>
  );
}
