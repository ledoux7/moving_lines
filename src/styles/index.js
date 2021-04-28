import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 180;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100%',

  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  loginButton: {
    // background: theme.palette.secondary.main
    // background: theme.palette.primary.main,

    margin: 10,
    fontSize: 16,
    '&:hover': {
      // backgroundColor: theme.palette.secondary.main,
      // background: theme.palette.primary.main,

    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  drawerOpen: {
    width: drawerWidth,
    overflow: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflow: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('md')]: {
      width: theme.spacing(8) + 1,
    },
    [theme.breakpoints.down('sm')]: {
      width: 0,
      display: 'none',
    },

  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // height: '100%',
  },

  // ///////////////////////
  margin: {
    // margin: theme.spacing(2),
    padding: 10,

    maxWidth: 450,
    // minWidth: 300,
    width: '90%',

    // background: 'grey',

  },
  padding: {
    // padding: theme.spacing(1),
    // height: '100%',
    // width: '100%',
    width: 500,
    // minWidth: 500,
    maxWidth: 600,

    padding: 10,

    // background: 'black',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',

  },
  rememberme: {
    marginTop: '10px',

  },
  animated: {
    fontSize: 22,
  },
  // menuButton: {
  //   marginRight: theme.spacing(2),
  // },
  formTitle: {
    textAlign: 'center',
  },
}));

export default useStyles;
