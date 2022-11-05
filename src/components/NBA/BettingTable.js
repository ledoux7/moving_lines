/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useTable, useSortBy } from 'react-table';
import Table from '../Table';

const state = {};

function BettingTable({ data, columns }) {
  const [autoColumns, setAutoColumns] = useState(null);

  useEffect(() => {
    if (!columns && data?.length) {
      const cols = Object.keys(data[0]).map(c => ({ Header: c, accessor: c }));
      setAutoColumns(cols);
    }
  }, [columns, data]);

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      overflow: 'scroll',
      maxWidth: '95vw',
    }}
    >
      <CssBaseline />
      <div style={{
        margin: 30,
        maxWidth: '90%',
        overflow: 'scroll',
      }}
      >
        {/* <h2>{data.team1Name}: {data.team1Score} PTS</h2> */}
        {data && data.length && (columns || autoColumns) && (
          <Table columns={columns || autoColumns} data={data} initialState={state} />
        )}
      </div>
    </div>
  );
}

export default BettingTable;
