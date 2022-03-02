import { Button } from '@material-ui/core';
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useHistory, useLocation } from 'react-router';
import Slider from '@material-ui/core/Slider';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useGetPBPForGame } from '../../hooks/analytics';
import PlaySelector from './PlaySelecter';

const Game = () => {
  const [showPlays, setShowPlays] = React.useState(false);

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const gameId = query.get('gameId');
  const [value, setValue] = React.useState([0, 0]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const history = useHistory();
  const handleSubmit = rangeArr => {
    history.push(`/playrange?gameId=${gameId}&start=${Math.round(rangeArr[0])}&end=${Math.round(rangeArr[1])}`);
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
  } = useGetPBPForGame(gameId);

  useEffect(() => {
    if (data) {
      setValue([data.pages[0].Items.length * 0.92, data.pages[0].Items.length - 1]);
    }
  }, [data]);

  function valuetext(value1) {
    if (!(data && data.pages && data.pages.length && data.pages[0].Items.length)) {
      return '0%';
    }
    return `${Math.round((value1 / data.pages[0].Items.length) * 100)}%`;
  }

  // TODO: make slider 3min left 4q
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      alignItems: 'center',
      overflow: 'scroll',
    }}
    >
      <h1>
        {/* Replay: {search} */}
        {/* [{valuetext(value[0])}, {valuetext(value[1])}] */}
        Game Timeline
      </h1>
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
      {
        !showPlays && (
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
                  getAriaValueText={valuetext}
                  valueLabelFormat={valuetext}
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
        )
      }
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
          {showPlays ? 'Show Slider' : 'Select Plays'}
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
