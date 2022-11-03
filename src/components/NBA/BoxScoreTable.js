/* eslint-disable react/no-array-index-key */
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useTable, useSortBy } from 'react-table';
import Table from '../Table';

function BoxScoreTable({ data }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'player',
        accessor: 'player', // accessor is the "key" in the data
      },
      {
        Header: 'MIN',
        accessor: 'min',
      },
      {
        Header: 'PTS',
        accessor: 'pts',
      },
      {
        Header: 'AST',
        accessor: 'ast',
      },
      {
        Header: 'reb',
        accessor: 'reb',
      },
      {
        Header: 'fg2',
        accessor: 'fg2',
      },
      {
        Header: 'fg3',
        accessor: 'fg3',
      },
      {
        Header: 'ft',
        accessor: 'ft',
      },
      {
        Header: '+/-',
        accessor: 'plus_minus',
      },
    ].map(e => {
      e.Header = e.Header.toUpperCase();
      return e;
    }),
    [],
  );

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
    }}
    >
      <CssBaseline />
      <div style={{
        margin: 30,
        maxWidth: '90%',
        overflow: 'scroll',
      }}
      >
        <h2>{data.team1Name}: {data.team1Score} PTS</h2>
        {data.team1 && data.team1.length && <Table columns={columns} data={data.team1} />}

      </div>

      <div style={{
        margin: 30,
        maxWidth: '90%',
        overflow: 'scroll',
      }}
      >
        <h2>{data.team2Name}: {data.team2Score} PTS</h2>

        {data.team2 && data.team2.length && <Table columns={columns} data={data.team2} />}
      </div>

    </div>
  );
}

export default BoxScoreTable;
