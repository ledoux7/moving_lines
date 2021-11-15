/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
import { Button } from '@material-ui/core';
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import {
  useQuery, useQueries, useMutation, useInfiniteQuery,
} from 'react-query';
import { useHistory, useLocation } from 'react-router';
import Slider from '@material-ui/core/Slider';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  fetchFromDynamoDb, fetchNew, fetchViaProxy, fetchPBP,
} from '../../api';
import { useGetPBPForGame } from '../../hooks/analytics';
import PlaySelector from './PlaySelecter';

const Game = () => {
  const [showPlays, setShowPlays] = React.useState(false);

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const gameId = query.get('gameId');

  const vidRef = useRef(null);

  const [value, setValue] = React.useState([0, 0]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const history = useHistory();
  const handleSubmit = rangeArr => {
    history.push(`/playrange?gameId=${gameId}&start=${rangeArr[0]}&end=${rangeArr[1]}`);
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isSuccess,
    isLoading,
  } = useGetPBPForGame(gameId);

  useEffect(() => {
    if (data) {
      setValue([data.pages[0].Items.length - 26, data.pages[0].Items.length - 1]);
      // setValue([data.pages[0].Items.length - 21, data.pages[0].Items.length - 1]);
      // setValue([data.pages[0].Items.length - 21, data.pages[0].Items.length - 1]);
    }
  }, [data]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      alignItems: 'center',
    }}
    >
      <h1>Replay: {search} {JSON.stringify(value)}</h1>
      {isLoading && (
        <div style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <CircularProgress />
        </div>
      )}
      <div style={{
        display: 'flex',
        // flex: 1,
        width: '100%',
      }}
      >

        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'scroll',
          maxHeight: 650,
          flexDirection: 'row',
          flexWrap: 'wrap',
          maxWidth: '100%',
        }}
        >

          {(data && data.pages) && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              alignItems: 'center',
            }}
            >
              <Slider
                value={value}
                onChange={handleChange}
                style={{
                  margin: '0px 20px',
                  width: '90%',
                  height: 50,
                  display: 'flex',
                  alignItems: 'flex-end',
                }}
              // valueLabelDisplay='auto'
                aria-labelledby='range-slider'
                valueLabelDisplay='on'
                disabled={data.pages[0].Items.length < 1}
                min={0}
                max={data.pages[0].Items.length - 1}
              />
              <Button
                variant='contained'
                style={{
                  textTransform: 'none',
                  width: 200,
                  fontSize: 26,
                  margin: '10px 10px',
                }}
                color='primary'
                onClick={() => handleSubmit(value)}
              >
                Play Range
              </Button>
            </div>
          )}

        </div>

      </div>
      {
        isSuccess && (
        <Button
          variant='contained'
          style={{
            textTransform: 'none',
            width: 200,
            fontSize: 26,
            margin: '10px 10px',
          }}
          color='primary'
          onClick={() => setShowPlays(prev => !prev)}
        >
          Show Plays
        </Button>

        )
      }
      {
        isSuccess && showPlays && (
          <PlaySelector
            value={1}
            data={data}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )
      }
      <div />
    </div>
  );
};

Game.propTypes = {

};

export default Game;
