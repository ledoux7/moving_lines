/* eslint-disable react/no-array-index-key */
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useTable, useSortBy } from 'react-table';

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps, headerGroups, rows, prepareRow,
  } = useTable({
    columns,
    data,
    initialState: {
      sortBy: [
        {
          id: 'pts',
          desc: true,
        },
      ],
    },
  },
  useSortBy);

  // Render the UI for your table
  return (
    <MaUTable {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup, i) => (
          <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, j) => (
              <TableCell key={j} {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <TableRow key={i} {...row.getRowProps()}>
              {row.cells.map((cell, j) => (
                <TableCell key={j} {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </MaUTable>
  );
}

function TableWrap({ data, rows }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'player',
        accessor: 'player', // accessor is the "key" in the data
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
      }}
      >
        <h2>{data.team1Name}: {data.team1Score} PTS</h2>
        {data.team1 && data.team1.length && <Table columns={columns} data={data.team1} />}

      </div>

      <div style={{
        margin: 30,
      }}
      >
        <h2>{data.team2Name}: {data.team2Score} PTS</h2>

        {data.team2 && data.team2.length && <Table columns={columns} data={data.team2} />}
      </div>

    </div>
  );
}

export default TableWrap;
