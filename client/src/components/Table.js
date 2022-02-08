import React, {useMemo, Component } from 'react';
import { useTable } from 'react-table';
import { DateTime } from "luxon";

export default function Table({ rawData }){
    console.log("raw data",rawData)

    // Create an object with the data from the database. Main point is to parse and format the createdAt date string.
    // temp readings seem to be close to 1 decimal accuracy  +/- ~0.0000004
    let parsedData = rawData.map(obj => {
        let rObj = {}
        rObj['createdAt'] = DateTime.fromISO(obj.createdAt).toFormat('LL/dd T')
        rObj['temperature'] = obj.temperature.toFixed(1)
        rObj['humidity'] = obj.humidity.toFixed(1)
        rObj['light'] = obj.light.toFixed(2)
        return rObj
    })
    console.log("parsed data",parsedData)

    const data = useMemo(() => parsedData, []);
    
    const columns = useMemo(
      () => [
        {
          Header: 'Time',
          accessor: 'createdAt',
        },
        {
          Header: 'Temp  (F)',
          accessor: 'temperature', // accessor is the "key" in the data
        },
        {
          Header: 'RH  (%)',
          accessor: 'humidity',
        },
        {
          Header: 'light  (v)',
          accessor: 'light',
        },
      ],
      []
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
