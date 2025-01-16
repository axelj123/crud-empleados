'use client';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';

const TableComponent = ({ data }) => {
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(
    () => [
      {
        header: 'Usuario',
        accessorFn: row => `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => (
          <div className="flex items-center gap-x-3">
            <img
              src={row.original.photo}
              className="w-10 h-10 rounded-full"
              alt="Foto del empleado"
            />
            <div>
              <span className="block text-gray-700 dark:text-white text-sm font-medium">
                {row.original.firstName} {row.original.lastName}
              </span>
              <span className="block text-gray-700 dark:text-white text-xs">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        header: 'Teléfono',
        accessorKey: 'phone',
      },
      {
        header: 'Posición',
        accessorFn: row => row.position.name,
      },
      {
        header: 'Salario',
        accessorKey: 'salary',
      },
      {
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="text-right">
            <button
              onClick={() => row.original.onEdit?.(row.original)}
              className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500"
            >
              Edit
            </button>
            <button
              onClick={() => row.original.onDelete?.(row.original)}
              className="py-2 px-3 font-medium text-red-600 hover:text-red-500"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="w-full ">
      <div className="  flex sm:justify-between items-left gap-4 mb-4 sm:flex-row flex-col ">
        <input
          type="text"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-gray-100 dark:bg-black"
          placeholder="Buscar..."
          
        />
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value));
          }}
          className="bg-white dark:bg-black px-4 py-2 border rounded-lg "
        >
          {[5, 10, 20, 30, 40, 50].map(pageSize => (
            <option className='' key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 shadow-sm border rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-white dark:bg-black text-black dark:text-white font-medium border-b">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="py-3 px-6">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-black dark:text-white  divide-y">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='px py-4 text-center'>
                  No hay datos para mostrar

                </td>
              </tr>
            ) : (
              
                table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              

            )}



          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Página{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </strong>
          <span  className='ml-4'>
            Total de empleados: 
            <strong> {data.length}</strong>
          </span >
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 rounded border hover:bg-gray-100 dark:hover:bg-gray-900 disabled:opacity-50"
          >
            Anterior
          </button>
          {Array.from({ length: table.getPageCount() }, (_, i) => (
            <button
              key={i}
              onClick={() => table.setPageIndex(i)}
              className={`px-3 py-1 rounded border ${table.getState().pagination.pageIndex === i
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-900'
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 rounded border hover:bg-gray-100 dark:hover:bg-gray-900 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;