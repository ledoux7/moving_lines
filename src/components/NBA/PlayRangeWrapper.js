/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
import { Button } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import {
  useQuery, useQueries, useMutation, useQueryClient,
} from 'react-query';
import { useLocation } from 'react-router';
import PlayRange from './PlayRange';

const PlayRangeWrapper = pbpData => {
  const [curPlay, setCurPlay] = useState(null);
  const [curLoaded, setCurLoaded] = useState(false);
  const [sourceUrl, setSourceUrl] = useState(null);

  const [curEventNum, setCurEventNum] = useState();
  const [curEventType, setCurEventType] = useState();
  const [dsc, setDsc] = useState(null);
  // const [pbpRange, setPBPRange] = useState([]);
  const queryClient = useQueryClient();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const gameId = query.get('gameId');
  const startRange = query.get('start');
  const endRange = query.get('end');

  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
    // checkedB: false,
  });

  useEffect(() => {
    setTimeout(() => setCurPlay(1), 5000);
  }, []);

  const ST = {
    [true]: 'Cached',
    [false]: 'Proxy',

  };

  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    }}
    >

      {/* <FormControlLabel
        style={{ margin: 0 }}
        control={
          <Switch
            checked={state.checkedB}
            onChange={handleChange}
            // defaultChecked
            name='checkedB'
            color='primary'
          />
        }
        label={ST[state.checkedB]}
        labelPlacement='end'
      /> */}

      {/* {curPlay && <PlayRange key={state.checkedB} cached={state.checkedB} />} */}
      <PlayRange key={state.checkedB} cached={state.checkedB} />

    </div>
  );
};

export default PlayRangeWrapper;
