import { Button } from '@material-ui/core';
import React, {
  useCallback, useMemo,
} from 'react';
import { useLocation } from 'react-router';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import PlayList from './PlayList';
import { useGetPBPForGame } from '../../hooks/analytics';

const PlayListWrapper = pbpData => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const [playersSel, setPlayersSel] = React.useState([]);
  const [playersMainSel, setPlayersMainSel] = React.useState([]);
  const [eventTypeSel, setEventType] = React.useState([]);
  const [isFGA, setIsFGA] = React.useState();
  const [periods, setPeriod] = React.useState([]);
  const [PBPArr, setPBPArr] = React.useState([]);
  const [showFilters, setShowFilters] = React.useState(true);

  const gameId = query.get('gameId');
  const {
    data,
  } = useGetPBPForGame(gameId);

  const filterObj = useMemo(() => {
    const a = 123;
    if (data && data.pages && data.pages[0].Items) {
      return {
        players: [
          ...new Set(
            data.pages[0].Items
              .filter(play => play.player1_name)
              .map(play => play.player1_name || play.player2_name || play.player3_name),
          ),
        ],
        eventType: [...new Set(data.pages[0].Items.map(play => play.event_type))],
        periods: [...new Set(data.pages[0].Items.map(play => play.period))],
        isFGA: ['Yes', 'No'],

      };
    }

    return {
      players: [],
      eventType: [],
      periods: [],
      isFGA: ['Yes', 'No'],
    };
  }, [data]);

  const filteredData = useMemo(() => {
    const a = 123;
    if (data && data.pages && data.pages[0].Items) {
      return [...data.pages[0].Items.filter(play => {
        if (
          (
            playersSel.length === 0
            || playersSel.includes(play.player1_name)
            || playersSel.includes(play.player2_name)
            || playersSel.includes(play.player2_name)
          )
          && (playersMainSel.length === 0 || playersMainSel.includes(play.player1_name))
          && (periods.includes(play.period) || periods.length === 0)
          && (eventTypeSel.includes(play.event_type) || eventTypeSel.length === 0)
          // eslint-disable-next-line eqeqeq
          && (isFGA == undefined || (isFGA === 'Yes' ? play.shot_attempt === true : !play.shot_attempt))
        ) {
          return true;
        }

        return false;
      })];
    }

    return [];
  }, [data, eventTypeSel, isFGA, periods, playersMainSel, playersSel]);

  const handleClick = useCallback(
    () => {
      const as = filteredData && filteredData.map((play, i) => ({
        eventType: play.event_type_id,
        eventNum: play.eventnum,
        gameId: play.game_id,
      }));
      setPBPArr(as);
      setShowFilters(p => !p);
    },
    [filteredData],
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      maxWidth: '90%',
      minWidth: '90%',
      paddingTop: 20,
      alignItems: 'center',
      height: 1400,

    }}
    >
      {
      // showFilters
      true
      && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
        >
          <Autocomplete
            multiple
            fullWidth
            disableCloseOnSelect
            id='tags-standard'
            options={filterObj ? filterObj.players : []}
            onChange={(event, newValue) => {
              console.log('nw', newValue);
              setPlayersSel(newValue);
            }}
            renderInput={params => (
              <TextField
                {...params}
                variant='standard'
                label='Players Involved'
                placeholder='Player names'
              />
            )}
          />
          <Autocomplete
            multiple
            fullWidth
            disableCloseOnSelect
            id='tags-standard'
            options={filterObj ? filterObj.players : []}
            onChange={(event, newValue) => {
              console.log('nw', newValue);
              setPlayersMainSel(newValue);
            }}
            renderInput={params => (
              <TextField
                {...params}
                variant='standard'
                label='Only Main Player'
                placeholder=''
              />
            )}
          />
          <Autocomplete
            multiple
            fullWidth
            disableCloseOnSelect
            id='tags-standard'
            options={filterObj ? filterObj.eventType : []}
            onChange={(event, newValue) => {
              console.log('nw', newValue);
              setEventType(newValue);
            }}
            renderInput={params => (
              <TextField
                {...params}
                variant='standard'
                label='Event Type'
                placeholder=''
              />
            )}
          />
          <Autocomplete
            fullWidth
            disableCloseOnSelect
            id='tags-standard'
            options={filterObj ? filterObj.isFGA : []}
            onChange={(event, newValue) => {
              console.log('nw', newValue);
              setIsFGA(newValue);
            }}
            renderInput={params => (
              <TextField
                {...params}
                variant='standard'
                label='Is FGA'
                placeholder=''
              />
            )}
          />
          <Autocomplete
            multiple
            fullWidth
            disableCloseOnSelect
            id='tags-standard'
            options={filterObj ? filterObj.periods : []}
            onChange={(event, newValue) => {
              console.log('nw', newValue);
              setPeriod(newValue);
            }}
            renderInput={params => (
              <TextField
                {...params}
                variant='standard'
                label='Periods'
                placeholder=''
              />
            )}
          />
        </div>
      )
    }
      <Button
        variant='contained'
        style={{
          textTransform: 'none',
          width: 200,
          fontSize: 26,
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'center',
        }}
        color='primary'
        onClick={() => handleClick()}
      >
        Play
      </Button>
      <PlayList arr={PBPArr} />
    </div>
  );
};

export default PlayListWrapper;
