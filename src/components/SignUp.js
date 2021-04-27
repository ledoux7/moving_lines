import React, { useState, useCallback, useEffect } from 'react';
import {
  Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox, Typography,
} from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';
import {
  Link, useHistory, useParams, useLocation,
} from 'react-router-dom';
import Auth from '@aws-amplify/auth';
import useStyles from '../styles';

function useQuery(searchString) {
  return new URLSearchParams();
}

const SignUp = () => {
  const loc = useLocation();
  const q = new URLSearchParams(loc.search).get('confirm');
  const [showCode, setShowCode] = useState(!!q);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(q || '');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const [qq, setQq] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(loc.search);
    const user = searchParams.get('confirm');
    if (user) {
      setShowCode(!!user);
      setUsername(user);
    }
  }, [loc.search]);

  const classes = useStyles();
  const history = useHistory();

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      Auth.signUp({
        username,
        password,
        attributes: {
          email, // optional
        },
      }).then(data => {
        console.log('signup', username, email);

        setShowCode(true);
      });
    },
    [email, password, username],
  );

  const onSubmitCode = useCallback(
    event => {
      event.preventDefault();
      console.log('code', code);
      Auth.confirmSignUp(username, code).then(data => {
        console.log('confimed');

        history.push('/');
      });
    },
    [code, history, username],
  );

  const onSubmitResend = useCallback(
    event => {
      event.preventDefault();
      Auth.resendSignUp(username).then(() => {
        console.log('code resent successfully');
      }).catch(e => {
        console.log(e);
      });
    },
    [username],
  );

  const signup = (
    <div>
      <Typography
        component='h1'
        variant='h4'
        noWrap
        align='center'
        style={{
          padding: 10,
        }}
      >
        Sign Up
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
              // size='large'
            fullWidth
            autoFocus
            required
            InputLabelProps={{ style: { fontSize: 24 } }} // font size of input label
            InputProps={{ style: { fontSize: 22 } }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} alignItems='flex-end'>
        <Grid item spacing={0}>
          <EmailIcon />
        </Grid>
        <Grid item md sm xs>
          <TextField
            id='email'
            label='Email'
            type='email'
            onChange={event => setEmail(event.target.value)}
            fullWidth
            required
            InputLabelProps={{ style: { fontSize: 24 } }} // font size of input label
            InputProps={{
              style: {
                fontSize: 22,
              },
            }}
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
              // size='large'
            fullWidth
            required
            InputLabelProps={{ style: { fontSize: 24 } }} // font size of input label
            InputProps={{ style: { fontSize: 22 } }}
          />
        </Grid>
      </Grid>

      <Grid
        container
        style={{ marginTop: '16px', width: '100%' }}
        justify='flex-end'
      >
        <Button
          variant='contained'
          style={{
            textTransform: 'none', width: '100%', height: 55, fontSize: 24,
          }}
          color='primary'
          onClick={onSubmit}
        >
          Sign Up
        </Button>
      </Grid>
    </div>
  );

  const confirm = (
    <div>
      <Typography
        component='h1'
        variant='h4'
        noWrap
        align='center'
        style={{
          padding: 10,
        }}
      >
        Confirm
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
            defaultValue={username}
              // size='large'
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
            id='code'
            label='Email Code'
            type='code'
            className={classes.animated}
            onChange={event => setCode(event.target.value)}
              // size='large'
            fullWidth
            autoFocus
            required
            InputLabelProps={{ style: { fontSize: 24 } }} // font size of input label
            InputProps={{ style: { fontSize: 22 } }}
          />
        </Grid>
      </Grid>

      <Grid
        container
        style={{ marginTop: '16px', width: '100%' }}
        justify='flex-end'
      >
        <Button
          variant='contained'
          style={{
            textTransform: 'none', width: '100%', height: 55, fontSize: 24,
          }}
          color='primary'
          onClick={onSubmitCode}
        >
          Confirm
        </Button>
        <Button
          variant='contained'
          style={{
            textTransform: 'none', width: '40%', marginTop: 20, height: 55, fontSize: 20,
          }}
          color='primary'
          onClick={onSubmitResend}
        >
          Resend Code
        </Button>
      </Grid>
    </div>
  );

  return (
    <Paper className={classes.padding}>
      <div className={classes.margin}>
        {!showCode && signup}
        {showCode && confirm}
      </div>
    </Paper>
  );
};

export default SignUp;
