import React, {useMemo, Component } from 'react';
import { useTable } from 'react-table';

export default function Table({ rawData }){
    console.log("raw data",rawData)
    const data = useMemo(() => rawData);
    
    const columns = useMemo(
      () => [
        {
          Header: 'Temperature',
          accessor: 'temperature', // accessor is the "key" in the data
        },
        {
          Header: 'Created At',
          accessor: 'createdAt',
        },
        {
          Header: 'Humidity',
          accessor: 'humidity',
        },
        {
          Header: 'light',
          accessor: 'light',
        },
        {
          Header: 'Updated At',
          accessor: 'updatedAt',
        },
      ]
    ) 

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data })

    return (
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
}
