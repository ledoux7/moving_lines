import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 180;
// const drawerWidth = 411;

const useStyles = makeStyles(theme => {
  // console.log('theme', theme);
  const a = 123;
  return {
    root: {
      display: 'flex',
      height: '100%',
      width: '100%',
      flexDirection: 'column',
    },
    content: {
      flex: 1,
      display: 'flex',
      // overflow: 'hidden',
      position: 'relative',
      justifyContent: 'center',
      marginLeft: 65,
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
      },
    },
    appBar: {
      // maxHeight: '8%',
      // minHeight: '8%',

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
      // [theme.breakpoints.down('md')]: {
      //   width: 0,
      // },
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

      // above main
      top: 0,
      flex: '1 0 auto',
      height: '100%',
      display: 'flex',
      outline: 0,
      zIndex: '1200',
      position: 'fixed',
      overflowY: 'auto',
      flexDirection: 'column',
      // [theme.breakpoints.down('md')]: {
      //   width: '100%',
      // },
    },
    drawerOpen: {
      width: drawerWidth,
      // overflow: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      // [theme.breakpoints.down('md')]: {
      //   width: '100%',
      // },
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      // overflow: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('md')]: {
        width: theme.spacing(8) + 1,
        // width: '100%',

      },
      [theme.breakpoints.down('sm')]: {
        width: 0,
        // width: '100vw',
        // width: '500px',

        display: 'none',
      },

    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      // padding: '0 8px',
      ...theme.mixins.toolbar,
    },

    // ///////////////////////
    margin: {
      padding: 10,
      width: '90%',
    },
    padding: {
      maxWidth: 650,
      padding: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',

      [theme.breakpoints.up('sm')]: {
        minWidth: 500,
      },

      [theme.breakpoints.down('sm')]: {
        width: '100%',
        minWidth: '100%',
      },
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

    listItem: {
      '& span': {
        color: theme.palette.text.primary,
      },

    },
  };
});

export default useStyles;
