/* eslint-disable react/display-name */
/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
import { Button } from '@material-ui/core';
import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import {
  useQuery, useQueries, useMutation, useInfiniteQuery,
} from 'react-query';
import { useHistory, useLocation } from 'react-router';
import Slider from '@material-ui/core/Slider';
import { Link } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useGetPBPForGame } from '../../hooks/analytics';
import {
  fetchFromDynamoDb, fetchNew, fetchViaProxy, fetchPBP,
} from '../../api';

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
];

const options = ['Option 1', 'Option 2'];

const PlaySelector = React.memo(({
  data, fetchNextPage, isFetchingNextPage, hasNextPage,
}) => {
  const [playersSel, setPlayersSel] = React.useState([]);
  const [playersMainSel, setPlayersMainSel] = React.useState([]);
  const [eventTypeSel, setEventType] = React.useState([]);
  const [isFGA, setIsFGA] = React.useState();
  const [periods, setPeriod] = React.useState([]);

  // const [value, setValue] = React.useState(options[0]);

  const [inputValue, setInputValue] = React.useState('');
  // const eventUpdates = React.useRef(0);
  const filterObj = useMemo(() => {
    const a = 123;
    if (data && data.pages && data.pages[0].Items) {
      return {
        players: [...new Set(data.pages[0].Items.filter(play => play.player1_name).map(play => play.player1_name || play.player2_name || play.player3_name))],
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
      // console.log({
      //   playersSel, playersMainSel, periods, eventTypeSel, isFGA, hmm: isFGA === undefined,
      // });
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

  const history = useHistory();
  const handleSubmit = (gameIdParam, eventNum, eventType) => {
    history.push(`/play?gameId=${gameIdParam}&eventNum=${eventNum}&eventType=${eventType}`);
  };

  // console.log('render', pbp);
  // console.log('p', filterObj.players);
  // console.log('render');
  return (
    <div style={{
      // overflow: 'scroll',
      display: 'flex',
      flex: 1,
      width: '90%',
      flexDirection: 'column',
    }}
    >
      <Autocomplete
        multiple
        fullWidth
        disableCloseOnSelect
        id='tags-standard'
        options={filterObj ? filterObj.players : []}
        // options={top100Films}
        // value={[value]}
        onChange={(event, newValue) => {
          console.log('nw', newValue);
          setPlayersSel(newValue);
        }}
        // inputValue={inputValue}
        // onInputChange={(event, newInputValue) => {
        //   setInputValue(newInputValue);
        // }}
        // getOptionLabel={option => option.title}
        // defaultValue={[top100Films[13]]}
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
        // multiple
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

      <div style={{
        display: 'flex',
        flex: 1,
        flexWrap: 'wrap',
        paddingTop: 20,
      }}
      >
        {(filteredData) && filteredData.map((play, i) => (
          <Button
            component={Link}
            to={`/play?gameId=${play.game_id}&eventNum=${play.eventnum}&eventType=${play.event_type_id}`}
            variant='contained'
            style={{
              textTransform: 'none',
              width: 200,
              fontSize: 26,
              margin: '10px 10px',
            }}
            color='primary'
            disabled={play.video === '0'}
          >
            {play.home_dsc || play.neutral_dsc || play.road_dsc }
          </Button>
        ))}

      </div>
      {/* <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
            ? 'Load More'
            : 'Nothing more to load'}
      </button> */}
    </div>
  );
});

export default PlaySelector;
