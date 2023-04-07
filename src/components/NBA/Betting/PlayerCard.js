/* eslint-disable react/display-name */

import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import {
  Card, CardContent, makeStyles, TextField, Typography, useTheme,
} from '@material-ui/core';
import { reboundingParams, REBOUNDING_COLS } from '../../../data/nba';
import MyTabs from '../../MyTabs';
import { usePlayerStats, useTeamStats } from '../../../hooks/nbaproxy';
import PlayerPieChart from '../../Charts/PlayerPieChart';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    // padding: 0,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 0,

  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

// eslint-disable-next-line max-len
const average = (arrAll, stat) => Math.round((arrAll.reduce((acc, cur) => acc + cur[stat], 0) / arrAll.length) * 100) / 100;

function ranking(arrAll, stat) {
  let currentCount = -1; let currentRank = 0;
  let stack = 1; // consecutive clients with same rating
  const array = [...arrAll];
  array.sort((a, b) => b[stat] - a[stat]);

  // console.log('ar', array);
  for (let i = 0; i < array.length; i++) {
    const result = array[i];
    if (currentCount !== result[stat]) {
      currentRank += stack;
      stack = 1;
    }
    else {
      stack++;
    }
    result[stat + '_RANK'] = currentRank;
    // result[stat + '_PCT_OF_MAX'] = result[stat] / array[0][stat];
    result[stat + '_PCT_OF_MAX'] = ((result[stat] - array[29][stat])) / (array[0][stat] - array[29][stat]);

    currentCount = result[stat];
  }
  return array;
}

const rankAll = (arrAll, cols) => {
  let arr = JSON.parse(JSON.stringify(arrAll));

  for (let i = 0; i < cols.length; i++) {
    arr = ranking(arr, cols[i]);
  }

  return arr;
};

const PlayerCard = ({
  endpoint, enabled, queryParams, columns, callback, transformFunc, playerId, measureType, cols,
}) => {
  const [oneTeamStat, setOneTeamStat] = useState(null);
  const [tabLabels, setTabLabels] = useState([]);
  const [tabContents, setTabContents] = useState([]);
  // const bothReboundingParams = useMemo(() => reboundingParams(), []);

  const {
    data,
    isSuccess: isSuccessDash,
    isLoading: isLoadingDash,
  } = usePlayerStats(0, 0, measureType);

  const {
    data: adv,
    // isSuccess: isSuccessDash,
    // isLoading: isLoadingDash,
  } = usePlayerStats(0, 0, 'Advanced');

  const createGraph = useCallback(
    type => {
      if (oneTeamStat) {
        if (type === 'PTS') {
          const testData = [
            {
              name: type,
              value: oneTeamStat.TS_PCT,
              raw: oneTeamStat[type],
              // rank: oneTeamStat[type + '_RANK'],
              rank: oneTeamStat.TS_PCT,

            },
            {
              name: 'Empty',
              value: 1 - oneTeamStat.TS_PCT,
            },
          ];
          // return <PlayerPieChart data={testData} />;
          return (
            <pre style={{ fontSize: 20 }}>
              {JSON.stringify({
                PTS: oneTeamStat[type],
                FGA: oneTeamStat.FGA,
                TS: oneTeamStat.TS_PCT,
                '3P%': oneTeamStat.FG3_PCT,
                USAGE: oneTeamStat.USG_PCT,

              }, null, 2)}
            </pre>
          );
        }
        else if (type === 'REB') {
          return (

            <pre style={{ fontSize: 20 }}>
              {JSON.stringify({
                REB: oneTeamStat.REB,
                OREB: oneTeamStat.OREB,
                DREB: oneTeamStat.DREB,
                OREB_PCT: oneTeamStat.OREB_PCT,
                DREB_PCT: oneTeamStat.DREB_PCT,

                // REB_RANK: oneTeamStat.REB_RANK,
                // OREB_RANK: oneTeamStat.OREB_RANK,
                // DREB_RANK: oneTeamStat.DREB_RANK,
                // OREB_PCT_RANK: oneTeamStat.OREB_PCT_RANK,
                // DREB_PCT_RANK: oneTeamStat.DREB_PCT_RANK,

              }, null, 2)}
            </pre>

          );
        }
        else if (type === 'AST') {
          return (
            <pre style={{ fontSize: 20 }}>
              {JSON.stringify({
                AST: oneTeamStat.AST,
                AST_PCT: oneTeamStat.AST_PCT,
              }, null, 2)}
            </pre>
          );
        }
        else {
          return (
            <pre style={{ fontSize: 20 }}>
              {JSON.stringify({
                [type]: oneTeamStat[type],

              }, null, 2)}
            </pre>
          );
        }
      }
      return null;
    },
    [oneTeamStat],
  );

  useEffect(() => {
    if (data?.transformed && adv?.transformed && playerId) {
      console.log({ data, adv });
      const oneBase = data?.transformed.find(t => t.PLAYER_ID === playerId);
      const oneAdv = adv?.transformed.find(t => t.PLAYER_ID === playerId);
      console.log({
        data, adv, oneBase, oneAdv,
      });

      const merged = {
        ...JSON.parse(JSON.stringify(oneBase)),
        ...JSON.parse(JSON.stringify(oneAdv)),
      };
      setOneTeamStat(merged);
      console.log('merge', merged);
    }
  }, [data, adv, playerId]);

  useEffect(() => {
    if (oneTeamStat) {
      const types = cols;

      for (let i = 0; i < types.length; i++) {
        const label = (types[i]);
        const content = createGraph(types[i]);

        setTabLabels(oldArray => [...oldArray, label]);
        setTabContents(oldArray => [...oldArray, content]);
        // }
      }
    }
  }, [cols, createGraph, oneTeamStat]);

  const theme = useTheme();
  const classes = useStyles();
  console.log(oneTeamStat);

  if (oneTeamStat) {
    return (
      <Card className={classes.root} style={{ margin: 15 }}>
        <div className={classes.details}>
          <CardContent className={classes.content} style={{ display: 'flex', flexDirection: 'column' }}>
            <MyTabs
              title={oneTeamStat.PLAYER}
              labels={tabLabels}
              tabContents={tabContents}
            />
          </CardContent>
        </div>
      </Card>
    );
  }

  return null;
};

export default PlayerCard;
