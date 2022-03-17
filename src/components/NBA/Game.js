/* eslint-disable max-len */
import { Button } from '@material-ui/core';
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useHistory, useLocation } from 'react-router';
import Slider from '@material-ui/core/Slider';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useGetBoxScoreGame, useGetPBPForGame } from '../../hooks/analytics';
import PlaySelector from './PlaySelecter';
import TableWrap from '../Table';
import { useAuthState } from '../../context/context';

const Game = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const gameId = query.get('gameId');
  const auth = useAuthState();

  const [value, setValue] = useState([0, 0]);
  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [showPlays, setShowPlays] = useState(false);
  const [showBoxScore, setShowBoxScore] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const history = useHistory();
  const handleSubmit = rangeArr => {
    history.push(`/playrange?gameId=${gameId}&start=${Math.round(rangeArr[0])}&end=${Math.round(rangeArr[1])}`);
  };

  const gotoList = rangeArr => {
    history.push(`/playlist?gameId=${gameId}`);
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
  } = useGetPBPForGame(gameId);

  const {
    data: boxscore,
    isSuccess: isSuccessBS,
    isLoading: isLoadingBS,
  } = useGetBoxScoreGame(gameId);

  useEffect(() => {
    if (data) {
      setValue([data.pages[0].Items.length * 0.92, data.pages[0].Items.length - 1]);
    }
  }, [data]);

  useEffect(() => {
    if (boxscore && boxscore.pages[0].Items && boxscore.pages[0].Items.length) {
      const ay2 = Object.entries(boxscore.pages[0].Items).map(([key, val]) => ({
        // ...val,
        player: val.player,
        team: val.team,
        min: Math.round(val.min),
        pts: val.pts,
        reb: val.reb,
        ast: val.ast,
        fg2: (val.fgm - val.fg3m) + ' / ' + (val.fga - val.fg3a),
        fg3: val.fg3m + ' / ' + val.fg3a,
        ft: val.ftm + ' / ' + val.fta,
        plus_minus: val.plus_minus,
        // efg: Math.round(val.efg * 100, 0) + '%',
        // fg2pct: Math.round(val.fg2pct * 100, 0) + '%',
        // fg3pct: Math.round(val.fg3pct * 100, 0) + '%',
        // ast2: Math.round(val.ast2 * 100, 0) + '%',
        // ast3: Math.round(val.ast3 * 100, 0) + '%',

      }));

      const ay = Object.entries(ay2[0]).map(([key, val]) => ({
        key,
        name: key,
        resizable: true,
        sortable: true,
        // editor: TextEditor,

      }));

      // setRows(boxscore.pages[0].Items);
      setCols(ay);
      setRows(ay2);

      const s = [...new Set(ay2.map(a => a.team))];
      setTableData({
        team1: ay2.filter(a => a.team === s[0]),
        team1Name: s[0],
        team1Score: ay2.filter(a => a.team === s[0]).reduce((acc, cur) => acc + parseInt(cur.pts, 10), 0),

        team2: ay2.filter(a => a.team === s[1]),
        team2Name: s[1],
        team2Score: ay2.filter(a => a.team === s[1]).reduce((acc, cur) => acc + parseInt(cur.pts, 10), 0),

      });
    }
  }, [boxscore]);

  function valuetext(value1) {
    if (!(data && data.pages && data.pages.length && data.pages[0].Items.length)) {
      return '0%';
    }
    return `${Math.round((value1 / data.pages[0].Items.length) * 100)}%`;
  }

  // TODO: make slider 3min left 4q
  const date = (boxscore?.pages[0]?.Items?.length && boxscore?.pages[0]?.Items[0]?.game_date);
  const dateStr = date && new Date((date / 1000) / 1000).toISOString().substring(0, 10);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      alignItems: 'center',
      overflow: 'scroll',
    }}
    >
      <h1 style={{ fontSize: 45 }}>
        {dateStr}
        {' '}
        {boxscore?.pages[0]?.Items?.length && boxscore?.pages[0]?.Items[0]?.matchup}
      </h1>
      {!showPlays && auth && auth.auth && boxscore?.pages[0]?.Items?.length && boxscore?.pages[0]?.Items[0]?.matchup && (
        <h1>Game Timeline</h1>
      )}
      {isLoading && isLoadingBS && (
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
        !showPlays && auth && auth.auth && (
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
                    width: 250,
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
      <div style={{ display: 'flex' }}>
        {
          isSuccess && !isLoadingBS && (
          <Button
            variant='contained'
            style={{
              textTransform: 'none',
              width: 250,
              fontSize: 26,
              margin: '10px 10px',
            }}
            color='primary'
            onClick={() => gotoList(value)}
          >
            View Highlights
          </Button>

          )
      }
        {
          isSuccess && !isLoadingBS && (
          <Button
            variant='contained'
            style={{
              textTransform: 'none',
              width: 250,
              fontSize: 26,
              margin: '10px 10px',
            }}
            color='primary'
            onClick={() => setShowPlays(prev => !prev)}
          >
            {(auth && auth.auth) ? showPlays ? 'Show Slider' : 'View PBP' : ''}
            {(auth && auth.unauth) ? showPlays ? 'Hide PBP' : 'View PBP' : ''}
          </Button>

          )
      }
        {
          isSuccess && isSuccessBS && (
          <Button
            variant='contained'
            style={{
              textTransform: 'none',
              width: 250,
              fontSize: 26,
              margin: '10px 10px',
            }}
            color='primary'
            onClick={() => setShowBoxScore(prev => !prev)}
          >
            {'Box Score'}
          </Button>

          )
        }
      </div>
      {
        showBoxScore && tableData && <TableWrap data={tableData} rows={rows} />
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
