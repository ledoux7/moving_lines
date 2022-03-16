import { Button, CircularProgress } from '@material-ui/core';
import React, {
  useEffect, useRef, useState,
} from 'react';
import { useHistory, useLocation } from 'react-router';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useGetShot3Log, useGetLeagueAvg3 } from '../../hooks/analytics';
import NBADropdown from './SubComp/NBADropdown';

const Pred = () => {
  const history = useHistory();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const qPlayerName = query.get('playerName');
  const ref = useRef(null);

  const [player, setPlayer] = useState(qPlayerName);
  const [fixedData, setFixedData] = useState([]);

  const {
    data,
    isLoading,
  } = useGetShot3Log(player);

  const {
    data: leagueAvg3Data,
  } = useGetLeagueAvg3();

  useEffect(() => {
    if (data && leagueAvg3Data) {
      const leagueAvg3 = leagueAvg3Data.pages[0];
      console.log(data);
      const biggie = data.pages
        .reduce((acc, cur) => acc.concat([...cur]), []);

      const cumulative = biggie.reduce((acc, val, i) => {
        const { res } = acc;
        let { make, miss } = acc;
        make += val.MAKE;
        miss += val.MISS;

        res.push({
          'Actual Percentage': make / (miss + make),
          'Padded Percentage': (make + leagueAvg3.padding * leagueAvg3.avg) / (miss + make + leagueAvg3.padding),
          'Shot Num': i + 1,
          'League Avg': leagueAvg3.avg,
        });
        return { make, miss, res };
      }, {
        make: 0,
        miss: 0,
        res: [],
      });
      // console.log({ cumulative, leagueAvg3 });

      setFixedData(cumulative.res.slice(10));
    }
    else {
      setFixedData([]);
    }
    return () => { };
  }, [data, leagueAvg3Data]);

  // console.log({ data1: data, fixedData });
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
      }}
      ref={ref}
    >
      <div style={{
        display: 'flex',
        width: '100%',
        flexWrap: 'wrap',
        paddingTop: 15,
        justifyContent: 'space-evenly',
      }}
      >
        <NBADropdown type='Player' callback={setPlayer} />
      </div>
      <h2 style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        margin: 0,
        paddingTop: 10,
        height: 40,
        alignItems: 'center',
      }}
      >
        {player}
        {isLoading && <CircularProgress style={{ marginLeft: 20 }} />}
      </h2>
      <div style={{
        width: '95%',
        height: 650,
      }}
      >
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            width={500}
            height={300}
            data={fixedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis
              label={{
                value: 'Shot Number', position: 'insideBottomRight', offset: -10, fill: 'white',
              }}
              dataKey='Shot Num'
              tick={{ fill: 'white', fontSize: '15px' }}
            />
            <YAxis
              label={{
                value: '3PT%', angle: -90, position: 'insideLeft', fill: 'white', offset: -10,
              }}
              tickCount={10}
              tick={{ fill: 'white', fontSize: '15px' }}
            />
            <Tooltip cursor />
            <Legend />
            <Line type='monotone' dataKey='Actual Percentage' stroke='#16ff05' strokeWidth={3} dot={false} />
            <Line type='monotone' dataKey='Padded Percentage' stroke='#ef6c00' strokeWidth={3} dot={false} />
            <Line type='monotone' dataKey='League Avg' stroke='red' strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Pred;
