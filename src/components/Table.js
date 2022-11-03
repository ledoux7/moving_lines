/* eslint-disable react/no-array-index-key */
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useTable, useSortBy } from 'react-table';

function Table({
  columns, data, initialState = {
    sortBy: [
      {
        id: 'pts',
        desc: true,
      },
    ],
  },
}) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps, headerGroups, rows, prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState,
    },
    useSortBy,
  );

  // Render the UI for your table
  return (
    <MaUTable
      {...getTableProps()}
      options={
        {
          rowStyle: {
            wordWrap: 'break-word',
          },
          padding: 'dense',
          tableLayout: 'auto',
          draggable: true,
        }
      }
      style={{ width: 'max-content' }}
    >
      <TableHead>
        {headerGroups.map((headerGroup, i) => (
          <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, j) => (
              <TableCell
                key={j}
                {...column.getHeaderProps(column.getSortByToggleProps())}
                // style={{ width: 90 }}
              >
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

export default Table;
