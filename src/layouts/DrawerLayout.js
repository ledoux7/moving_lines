/* eslint-disable react/display-name */
import React, { useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CalendarTodayIcon from '@material-ui/icons//CalendarToday';
import SettingsIcon from '@material-ui/icons/Settings';
import { Link, useHistory } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import PhotoIcon from '@material-ui/icons/Photo';
import ChatIcon from '@material-ui/icons/Chat';
import ClearIcon from '@material-ui/icons/Clear';
import TimelineIcon from '@material-ui/icons/Timeline';
import FlagIcon from '@material-ui/icons/Flag';
import Auth from '@aws-amplify/auth';
import { Button, SwipeableDrawer } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonIcon from '@material-ui/icons/Person';
import BubbleChart from '@material-ui/icons/BubbleChart';
import { Shuffle } from '@material-ui/icons';
import useStyles from '../styles';
import ListItemLink from '../components/ListItemLink';
import { loginUser, useAuthState, useAuthDispatch } from '../context/context';

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

function rand() {
  return Math.round(Math.random() * 20) - 10;
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

// const drawerWidth = 240;

const MyComponent = React.memo(props => {
  /* render using props */
});

const createArr = [
  {
    to: '/',
    name: 'Home',
    icon: <HomeIcon />,
  },
  // {
  //   to: '/dash',
  //   name: 'Dashboard',
  //   icon: <DashboardIcon />,
  // },
  // {
  //   to: '/schedule',
  //   name: 'Schedule',
  //   icon: <CalendarTodayIcon />,
  // },
  {
    to: '/games',
    name: 'Games',
    icon: <OndemandVideoIcon />,
  },
  {
    to: '/random',
    name: 'Random',
    icon: <Shuffle />,
  },
  {
    to: '/shots',
    name: 'Shot Chart',
    icon: <BubbleChart />,
  },
  {
    to: '/3pt',
    name: '3PT Stability',
    icon: <TimelineIcon />,
  },

  // {
  //   to: '/isit',
  //   name: 'Foul',
  //   icon: <FlagIcon />,
  // },
  // {
  //   to: '/upload',
  //   name: 'Photos',
  //   icon: <PhotoIcon />,
  // },
  // {
  //   to: '/live',
  //   name: 'Live',
  //   icon: <OndemandVideoIcon />,
  // },
  // {
  //   to: '/chat',
  //   name: 'Chat',
  //   icon: <ChatIcon />,
  // },
];

const arr = createArr.map(l => (
  <ListItemLink to={l.to} icon={l.icon} name={l.name} key={l.name} />
));

export default function MyDrawer({
  setOpenModal, openModal, setOpen, open, scrollTrigger,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const auth = useAuthState();
  const history = useHistory;
  const dispatch = useAuthDispatch();

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

  const signOut = useCallback(
    () => {
      Auth.signOut().then(signout => {
        dispatch({ type: 'LOGOUT' });
        Auth.currentUserCredentials().then(userCred => {
          console.log('login cred', userCred);
          dispatch({ type: 'CREDENTIALS', payload: { data: userCred } });
        }).catch(e => {
          console.log('err unauth');
          dispatch({ type: 'CREDENTIALS', payload: null });
        });
      });
    },
    [dispatch],
  );

  return (
    <SwipeableDrawer
      variant='permanent'
      onClose={handleDrawerClose}
      onOpen={handleDrawerOpen}
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
      open={open}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={() => setOpen(o => !o)}>
          {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>
      <Divider />
      <List>
        {arr}
      </List>
      <Divider />
      <List style={{ flexDirection: 'column', display: 'flex', backgroundClip: undefined }}>
        {!auth.auth && <ListItemLink to={'/login'} icon={<PersonIcon />} name={'Sign In'} onClick1={() => history.push('/login')} />}
        {!auth.auth && <ListItemLink to={'/signup'} icon={<PersonAddIcon />} name={'Sign Up'} onClick1={() => history.push('/signup')} />}

        <ListItemLink to={''} icon={<SettingsIcon />} name={'Settings'} button onClick={handleOpen} />
        {auth.auth && <ListItemLink to={''} icon={<ClearIcon />} name={'Sign Out'} button onClick={signOut} />}
      </List>
    </SwipeableDrawer>
  );
}
