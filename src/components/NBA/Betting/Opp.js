/* eslint-disable react/display-name */

import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import {
  Card, CardContent, makeStyles, Typography, useTheme,
} from '@material-ui/core';
import {
  useProxyNBA,
} from '../../../hooks/analytics';
import BettingTable from './BettingTable';
import { reboundingParams, REBOUNDING_COLS } from '../../../data/nba';
import MyTabs from '../../MyTabs';
import EmptyPieChart from '../../Charts/BettingPieChart';
import { useTeamStats } from '../../../hooks/nbaproxy';

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

const finalCols = [
  // 'TEAM_ID', 'TEAM',
  'REB', 'REB_RANK', 'REB_AVG', 'REB_CONTEST_PCT', 'REB_CONTEST_PCT_RANK', 'REB_CONTEST_PCT_AVG', 'REB_CHANCES', 'REB_CHANCES_RANK', 'REB_CHANCES_AVG', 'REB_CHANCE_PCT', 'REB_CHANCE_PCT_RANK', 'REB_CHANCE_PCT_AVG',
  'OREB', 'OREB_RANK', 'OREB_AVG', 'OREB_CONTEST_PCT', 'OREB_CONTEST_PCT_RANK', 'OREB_CONTEST_PCT_AVG', 'OREB_CHANCES', 'OREB_CHANCES_RANK', 'OREB_CHANCES_AVG', 'OREB_CHANCE_PCT', 'OREB_CHANCE_PCT_RANK', 'OREB_CHANCE_PCT_AVG',
  'DREB', 'DREB_RANK', 'DREB_AVG', 'DREB_CONTEST_PCT', 'DREB_CONTEST_PCT_RANK', 'DREB_CONTEST_PCT_AVG', 'DREB_CHANCES', 'DREB_CHANCES_RANK', 'DREB_CHANCES_AVG', 'DREB_CHANCE_PCT', 'DREB_CHANCE_PCT_RANK', 'DREB_CHANCE_PCT_AVG',
];

//     // const ft = cc.reduce((acc, cur, i) => {
//     //   acc[cur] = teamStat[cur];
//     //   return acc;
//     // }, {});

const Opp = ({
  endpoint, enabled, queryParams, columns, callback, transformFunc, teamId,
}) => {
  const [fixed, setFixed] = useState(null);
  // const [teamStat, setTeamStat] = useState(null);
  const [oppStat, setOppStat] = useState(null);

  const [avgs, setAvgs] = useState(null);
  const [tabLabels, setTabLabels] = useState([]);
  const [tabContents, setTabContents] = useState([]);
  const bothReboundingParams = useMemo(() => reboundingParams(), []);

  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);

  // const {
  //   data,
  //   isSuccess: isSuccessDash,
  //   isLoading: isLoadingDash,
  // } = useTeamStats(0, 0);

  const {
    data: opp,
    // isSuccess: isSuccessDash,
    // isLoading: isLoadingDash,
  } = useTeamStats(0, 0, 'Opponent');

  const createGraph = useCallback(
    type => {
      if (oppStat) {
        console.log('what opp', type);
        const testData = [
          {
            name: type,
            value: oppStat[type + '_PCT_OF_MAX'],
            raw: oppStat[type],
            rank: oppStat[type + '_RANK'],
          },
          {
            name: 'Empty',
            value: 1 - oppStat[type + '_PCT_OF_MAX'],
          },
        ];
        return <EmptyPieChart data={testData} />;
      }
      return null;
    },
    [oppStat],
  );

  useEffect(() => {
    if (opp && opp?.transformed && opp?.endpoint === 'leaguedashteamstats' && teamId
    ) {
      console.log({ minus: opp?.transformed });
      // const res = transformFunc(data?.transformed);
      const colsCareAbout = [
        'OPP_REB', 'OPP_FGA', 'OPP_FG3A', 'OPP_FG3_PCT', 'OPP_FG_MISS',
      ];
      // let ranked = JSON.parse(JSON.stringify(data?.transformed));
      const calc = JSON.parse(JSON.stringify(opp?.transformed)).map(t => {
        // eslint-disable-next-line no-param-reassign
        t.OPP_FG_MISS = Math.round((t.OPP_FGA - t.OPP_FGM) * 100) / 100;
        return t;
      });
      const one = rankAll(calc, colsCareAbout).find(t => t.TEAM_ID === teamId);

      const select = colsCareAbout.reduce((acc, cur, i) => {
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

      // setAvgs(avgs);
      // setTeamStat(select);
      setOppStat(select);

      // setFixed(calc);
    }
    else {
      // setFixed(data?.transformed);
    }
  }, [avgs, opp, teamId, transformFunc]);

  useEffect(() => {
    if (oppStat) {
      const types = ['OPP_REB', 'OPP_FGA', 'OPP_FG3A', 'OPP_FG3_PCT', 'OPP_FG_MISS'];
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
          // setTabLabels()
          setTabLabels(oldArray => [...oldArray, label]);
          setTabContents(oldArray => [...oldArray, content]);
        }
      }
    }
  }, [createGraph, oppStat]);

  const theme = useTheme();
  const classes = useStyles();

  if (oppStat) {
    return (
      <Card className={classes.root} style={{ margin: 20 }}>
        <div className={classes.details}>
          <CardContent className={classes.content} style={{ display: 'flex', flexDirection: 'column' }}>
            <MyTabs
              title={oppStat.TEAM}
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

export default Opp;
