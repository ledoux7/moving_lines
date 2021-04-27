import React, { useCallback, useState } from 'react';
import {
  Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox, Typography,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import { Link, useHistory } from 'react-router-dom';
import Auth from '@aws-amplify/auth';
import useStyles from '../styles';
import { useAuthDispatch } from '../context/context';

const LoginTab = props => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [code, setCode] = useState(false);

  const history = useHistory();
  const dispatch = useAuthDispatch();

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      const user = Auth.signIn(username, password)
        .then(data => {
          console.log('signin', data);
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data } });

          Auth.currentUserCredentials().then(userCred => {
            console.log('login cred', userCred);
            dispatch({ type: 'CREDENTIALS', payload: { data: userCred } });
            history.goBack();
          }).catch(e => {
            console.log('err unauth');
            dispatch({ type: 'CREDENTIALS', payload: null });
          });
        })
        .catch(e => {
          console.log('err', e);
          // "UserNotConfirmedException"
          dispatch({ type: 'LOGIN_FAILD' });
        });
    },
    [dispatch, history, password, username],
  );

  const a = (
    <div>
      <Typography component='h1' variant='h4' noWrap align='center'>
        Login
      </Typography>
      <Grid container spacing={4} alignItems='flex-end'>
        <Grid item>
          <AccountCircleIcon />
        </Grid>
        <Grid item md sm xs>
          <TextField
            id='username'
            label='Username'
            type='email'
            className={classes.animated}
            onChange={event => setUsername(event.target.value)}
            fullWidth
            autoFocus
            required
            InputLabelProps={{ style: { fontSize: 24 } }} // font size of input label
            InputProps={{ style: { fontSize: 22 } }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} alignItems='flex-end'>
        <Grid item>
          <LockIcon />
        </Grid>
        <Grid item md sm xs>
          <TextField
            id='password'
            label='Password'
            type='password'
            onChange={event => setPassword(event.target.value)}
            fullWidth
            required
            InputLabelProps={{ style: { fontSize: 24 } }} // font size of input label
            InputProps={{ style: { fontSize: 22 } }}
          />
        </Grid>
      </Grid>
      <Grid container alignItems='flex-end' justify='space-between' className={classes.rememberme}>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                color='primary'
              />
              }
            label='Remember me'
          />
        </Grid>
        <Grid item>
          <Button disableFocusRipple disableRipple style={{ textTransform: 'none' }} variant='text' color='primary'>Forgot password ?</Button>
        </Grid>
      </Grid>
      <Grid container justify='flex-start' style={{ marginTop: '10px' }}>
        <Button
          variant='contained'
          style={{
            textTransform: 'none', width: '100%', height: 55, fontSize: 26,
          }}
          color='primary'
          onClick={onSubmit}
        >
          Login
        </Button>
      </Grid>
    </div>
  );

  return (
    <Paper className={classes.padding}>
      <div className={classes.margin}>
        {a}
      </div>
    </Paper>
  );
};

export default LoginTab;
