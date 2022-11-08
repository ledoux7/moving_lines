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

// const ranking = (arrAll, stat) => {
//   const array = [...arrAll];
//   array.sort((a, b) => b[stat] - a[stat]);

//   let rank = 1;
//   for (let i = 0; i < array.length; i++) {
//   // increase rank only if current score less than previous
//     if (i > 0 && array[i][stat] < array[i - 1][stat]) {
//       rank++;
//     }
//     array[i][stat + '_RANK'] = rank;
//   }
//   return array;
// };

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

    // ((input - min) * 100) / (max - min)
    // ((result[stat] - array[29][stat]) * 100) / (array[0][stat] - array[29][stat])

    currentCount = result[stat];
  }
  return array;
}

// const percentile = (arrAll, stat) => {
//   let count = 0;
//   const array = [...arrAll];
//   array.sort((a, b) => b[stat] - a[stat]);

//   arr.forEach(v => {
//     if (v < val) {
//       count++;
//     }
//     else if (v === val) {
//       count += 0.5;
//     }
//   });
//   return (100 * count) / arr.length;
// };

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

const Rebounding = ({
  endpoint, enabled, queryParams, columns, callback, transformFunc, teamId,
}) => {
  const [fixed, setFixed] = useState(null);
  const [teamStat, setTeamStat] = useState(null);

  const [avgs, setAvgs] = useState(null);
  const [tabLabels, setTabLabels] = useState([]);
  const [tabContents, setTabContents] = useState([]);
  // const tabLabels = [];
  // const tabContents = [];
  const bothReboundingParams = useMemo(() => reboundingParams(), []);

  const {
    data,
    // isSuccess,
    // isLoading,
  } = useProxyNBA('leaguedashptstats', bothReboundingParams, !!true);

  const createGraph = useCallback(
    type => {
      if (teamStat) {
        const testData = [
          {
            name: type,
            value: teamStat[type + '_PCT_OF_MAX'],
            raw: teamStat[type],
            rank: teamStat[type + '_RANK'],

            // raw: teamStat.REB,
            // rank: teamStat.REB_RANK,
          },
          {
            name: 'Empty',
            value: 1 - teamStat[type + '_PCT_OF_MAX'],
          },
        ];
        return <EmptyPieChart data={testData} />;
      }
      return null;
    },
    [teamStat],
  );

  useEffect(() => {
    if (data && data?.transformed && data?.endpoint === 'leaguedashptstats' && teamId) {
      console.log({ data });
      // const res = transformFunc(data?.transformed);
      const colsCareAbout = [
        'REB', 'REB_CONTEST_PCT', 'REB_CHANCES', 'REB_CHANCE_PCT',
        'OREB', 'OREB_CONTEST_PCT', 'OREB_CHANCES', 'OREB_CHANCE_PCT',
        'DREB', 'DREB_CONTEST_PCT', 'DREB_CHANCES', 'DREB_CHANCE_PCT',

      ];
      // setFixed(res);
      // let ranked = JSON.parse(JSON.stringify(data?.transformed));
      const calc = JSON.parse(JSON.stringify(data?.transformed));
      // const ranked = JSON.parse(JSON.stringify(data?.transformed));

      // ranked = ranking(ranked, 'W');

      // ranked = ranking(ranked, 'REB');
      // ranked = ranking(ranked, 'OREB');
      // ranked = ranking(ranked, 'DREB');

      // ranked = ranking(ranked, 'REB_CHANCES');
      // ranked = ranking(ranked, 'OREB_CHANCES');
      // ranked = ranking(ranked, 'DREB_CHANCES');

      // ranked = ranking(ranked, 'REB_CHANCE_PCT');
      // ranked = ranking(ranked, 'OREB_CHANCE_PCT');
      // ranked = ranking(ranked, 'DREB_CHANCE_PCT');
      // const averages = {
      //   REB: average(calc, 'REB'),
      //   OREB: average(calc, 'OREB'),
      //   DREB: average(calc, 'DREB'),
      //   'REB_CHANCES': average(calc, 'REB_CHANCES'),
      //   'OREB_CHANCES': average(calc, 'OREB_CHANCES'),
      //   'DREB_CHANCES': average(calc, 'DREB_CHANCES'),

      //   'REB_CHANCE_PCT': average(calc, 'REB_CHANCE_PCT'),
      //   'OREB_CHANCE_PCT': average(calc, 'OREB_CHANCE_PCT'),
      //   'DREB_CHANCE_PCT': average(calc, 'DREB_CHANCE_PCT'),

      //   // 'REB_RANK': ranking(data?.transformed, 'REB'),

      // };

      const one = rankAll(calc, colsCareAbout).find(t => t.TEAM_ID === teamId);
      // console.log({ one, teamId });
      const select = colsCareAbout.reduce((acc, cur, i) => {
        if (i === 0) {
          acc.TEAM_ID = one.TEAM_ID;
          acc.TEAM = one.TEAM_ABBREVIATION;
        }
        acc[cur] = one[cur];
        acc[cur + '_RANK'] = one[cur + '_RANK'];
        acc[cur + '_PCT_OF_MAX'] = one[cur + '_PCT_OF_MAX'];
        acc[cur + '_AVG'] = average(calc, cur);
        return acc;
      }, {});

      setAvgs(avgs);
      setTeamStat(select);
      setFixed(calc);

      // console.log(Object.keys(select),
      // .map(c => ({ Header: c, accessor: c }))
      // );
    }
    else {
      setFixed(data?.transformed);
    }
  }, [avgs, data, teamId, transformFunc]);

  useEffect(() => {
    if (teamStat) {
      console.log({ teamStat });
      const types = ['REB', 'OREB', 'DREB'];
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
  }, [createGraph, teamStat]);

  const theme = useTheme();
  const classes = useStyles();

  const reb = createGraph('REB');
  const oreb = createGraph('OREB');
  const dreb = createGraph('DREB');

  if (teamStat) {
    return (
      <Card className={classes.root} style={{ margin: 20 }}>
        <div className={classes.details}>
          <CardContent className={classes.content} style={{ display: 'flex', flexDirection: 'column' }}>
            <MyTabs
              title={teamStat.TEAM}
              labels={tabLabels}
              tabContents={tabContents}
            />
            {/* <Typography component='h5' variant='h3' style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              {teamStat.TEAM}
            </Typography> */}
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <pre>
        {/* {JSON.stringify(avgs, null, 2)} */}
        {JSON.stringify(teamStat, null, 2)}

      </pre>

      {/* <BettingTable
      // data={tableData.filter(t => (t.TEAM_ID === homeTeamId) || (t.TEAM_ID === awayTeamId))}
        data={fixed}
        columns={columns}
      /> */}
    </div>
  );
};

export default Rebounding;
