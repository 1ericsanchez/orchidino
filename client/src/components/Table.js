import React, {useMemo, Component } from 'react';
import { useSortBy, usePagination, useTable } from 'react-table';
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
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: {pageIndex, pageSize},
    } = useTable(
        { 
            columns, 
            data, 
            // initialState: {pageIndex:2},
            initialState: {sortBy: [
                {
                    id: 'createdAt',
                    desc: true
                }
            ]}
        },
        useSortBy,
        usePagination)

    return (
        <>
        {/* This pre just creates and displays a json containing the pagination properties */}
        {/* <pre>
          <code>
            {JSON.stringify(
              {
                pageIndex,
                pageSize,
                pageCount,
                canNextPage,
                canPreviousPage,
              },
              null,
              2
            )}
          </code>
        </pre> */}
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        {/* 
          Pagination can be built however you'd like. 
          This is just a very basic UI implementation:
        */}
        <div className="pagination">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>{' '}
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <span>
            | Go to page:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
              style={{ width: '100px' }}
            />
          </span>{' '}
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </>
    );
}
