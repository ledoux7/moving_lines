import React from 'react';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {
  Switch, FormGroup, FormControlLabel, Typography, SwipeableDrawer, Button,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import useStyles from '../styles';
import { StoreContext } from '../store';
import MyDrawer from './DrawerLayout';
import { useAuthState } from '../context/context';
import ErrorBoundary from '../utils/ErrorBoundary';

const MyLink = ({ to, children }) => (
  <Link
    to={to}
    style={{
      textDecoration: 'none',
      color: '#FFFFFF',
    }}
  >
    {children}
  </Link>
);

// function HideOnScroll(props) {
//   const { children, window } = props;
//   // Note that you normally won't need to set the window ref as useScrollTrigger
//   // will default to window.
//   // This is only being set here because the demo is in an iframe.
//   const trigger = useScrollTrigger({ target: window ? window() : undefined });

//   return (
//     <Slide appear={false} direction='down' in={!trigger}>
//       {children}
//     </Slide>
//   );
// }

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
    transform: `translate(-${top - 10}%, -${left}%)`,
  };
}

// const drawerWidth = 180;

export default function MiniDrawer({ children }) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [appBarVisibilty, toggleAppBar] = React.useState(true);
  const history = useHistory();

  const [modalStyle] = React.useState(getModalStyle);
  const auth = useAuthState();
  const {
    darkModeState, toggleDarkMode, toggleVideoMenuPosition, videoMenuPostion,
  } = React.useContext(StoreContext);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

  const switch1 = (
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

  const switch2 = (
    <FormControlLabel
      value='start'
      label='Toggle App Bar'
      labelPlacement='start'
      control={(
        <Switch checked={appBarVisibilty} onClick={() => toggleAppBar(c => !c)} label={'Toggle App Bar'} />
          )}
    />
  );

  const switch3 = (
    <FormControlLabel
      value='start'
      label='Toggle Video Menu Position'
      labelPlacement='start'
      control={(
        <Switch checked={videoMenuPostion} onClick={() => toggleVideoMenuPosition(c => !c)} label={'Toggle Video Menu Position'} />
          )}
    />
  );

  const body = (
    <div
      // style={modalStyle}
      style={{
        ...modalStyle,
        position: 'absolute',
        width: 340,
        height: 210,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: 25,
      }}
    >
      {switch1}
      {switch2}
      {switch3}
    </div>
  );

  const errorComp = (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      // alignItems: 'center',
      flex: 1,
    }}
    >
      <h1>
        Error
      </h1>
    </div>
  );

  return (
    <div className={classes.root}>
      {/* <CssBaseline /> */}
      {
        (appBarVisibilty) && (
          <AppBar
            position='sticky'
            style={{
              height: 64,
            }}
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                // eslint-disable-next-line react/jsx-no-bind
                onClick={handleDrawerOpen}
                edge='start'
                className={clsx(classes.menuButton, {
                  [classes.hide]: open,
                })}
              >
                <MenuIcon />
              </IconButton>
              <Typography component='h1' variant='h5' noWrap className={classes.title}>
                Moving Lines
              </Typography>
            </Toolbar>
          </AppBar>
        )
      }
      <MyDrawer
        setOpenModal={setOpenModal}
        setOpen={setOpen}
        open={open}
        openModal={openModal}
      />
      <ErrorBoundary fallback={errorComp}>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {children}
        </main>
      </ErrorBoundary>
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
