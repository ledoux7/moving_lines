/* eslint-disable react/display-name */

import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import {
  Card, CardContent, makeStyles, Typography, useTheme,
} from '@material-ui/core';
import { reboundingParams, REBOUNDING_COLS } from '../../../data/nba';
import MyTabs from '../../MyTabs';
import { useTeamStats } from '../../../hooks/nbaproxy';
import BettingPieChart from '../../Charts/BettingPieChart';

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

const TeamCard = ({
  endpoint, enabled, queryParams, columns, callback, transformFunc, teamId, measureType, cols,
}) => {
  const [oneTeamStat, setOneTeamStat] = useState(null);

  const [tabLabels, setTabLabels] = useState([]);
  const [tabContents, setTabContents] = useState([]);
  // const bothReboundingParams = useMemo(() => reboundingParams(), []);

  const {
    data,
    isSuccess: isSuccessDash,
    isLoading: isLoadingDash,
  } = useTeamStats(0, 0, measureType);

  const createGraph = useCallback(
    type => {
      if (oneTeamStat) {
        const testData = [
          {
            name: type,
            value: oneTeamStat[type + '_PCT_OF_MAX'],
            raw: oneTeamStat[type],
            rank: oneTeamStat[type + '_RANK'],
          },
          {
            name: 'Empty',
            value: 1 - oneTeamStat[type + '_PCT_OF_MAX'],
          },
        ];
        return <BettingPieChart data={testData} />;
      }
      return null;
    },
    [oneTeamStat],
  );

  useEffect(() => {
    if (data && data?.transformed && data?.endpoint === 'leaguedashteamstats' && teamId
    ) {
      let calc = JSON.parse(JSON.stringify(data?.transformed));
      if (measureType === 'Base') {
        calc = calc.map(t => {
          // eslint-disable-next-line no-param-reassign
          t.FG_MISS = Math.round((t.FGA - t.FGM) * 100) / 100;
          return t;
        });
      }
      else if (measureType === 'Opponent') {
        calc = calc.map(t => {
          // eslint-disable-next-line no-param-reassign
          t.OPP_FG_MISS = Math.round((t.OPP_FGA - t.OPP_FGM) * 100) / 100;
          return t;
        });
      }
      // eslint-disable-next-line eqeqeq
      const one = rankAll(calc, cols).find(t => t.TEAM_ID == teamId);

      const select = cols.reduce((acc, cur, i) => {
        if (i === 0) {
          acc.TEAM_ID = one.TEAM_ID;
          acc.TEAM = one.TEAM_NAME;
        }

        acc[cur] = one[cur];
        acc[cur + '_RANK'] = one[cur + '_RANK'];
        acc[cur + '_PCT_OF_MAX'] = one[cur + '_PCT_OF_MAX'];
        acc[cur + '_AVG'] = average(calc, cur);

        return acc;
      }, {});

      setOneTeamStat(select);
    }
    else {
      //
    }
  }, [data, cols, measureType, teamId, transformFunc]);

  useEffect(() => {
    if (oneTeamStat) {
      const types = cols;
      const cat = [
        '',
        // '_CHANCES',
        // '_CHANCE_PCT',
        // '_CONTEST_PCT',
      ];
      for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < cat.length; j++) {
          const label = (types[i] + cat[j]);
          const content = createGraph(types[i] + cat[j]);

          setTabLabels(oldArray => [...oldArray, label]);
          setTabContents(oldArray => [...oldArray, content]);
        }
      }
    }
  }, [createGraph, cols, oneTeamStat]);

  const theme = useTheme();
  const classes = useStyles();

  if (oneTeamStat) {
    return (
      <Card className={classes.root} style={{ margin: 15 }}>
        <div className={classes.details}>
          <CardContent className={classes.content} style={{ display: 'flex', flexDirection: 'column' }}>
            <MyTabs
              title={oneTeamStat.TEAM}
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

export default TeamCard;
