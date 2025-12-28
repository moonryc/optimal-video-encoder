
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ReactNode } from 'react';

export type TransposableTableProps = {
  transpose?: boolean;
  headers: ReactNode[];
  rows: Array<ReactNode[] | ReactNode>;
};

const TransposableTable = ({
  transpose = false,
  headers,
  rows,
}: TransposableTableProps) => {
  const safeRows = Array.isArray(rows) ? rows : [];
  const hasData = headers.length > 0 && safeRows.length > 0;

  const isSingleRow = safeRows.length > 0 && safeRows.every((row) => !Array.isArray(row));

  const normalizeRow = (row: ReactNode[] | ReactNode): ReactNode[] => {
    if (Array.isArray(row)) return row;
    return [row];
  };

  // For a flat array of values, treat it as a single row aligned to headers.
  const paddedRows = isSingleRow
    ? [headers.map((_, idx) => (safeRows as ReactNode[])[idx] ?? '')]
    : safeRows.map((row) => {
        const normalized = normalizeRow(row);
        // Ensure each row length matches headers length to avoid undefined cells.
        return headers.map((_, idx) => normalized[idx] ?? '');
      });

  const transposedHeaders = isSingleRow
    ? ['Field', 'Value']
    : [''].concat(paddedRows.map((_, rowIndex) => `Row ${rowIndex + 1}`));

  const transposedRows = isSingleRow
    ? headers.map((header, idx) => [header, paddedRows[0]?.[idx] ?? ''])
    : headers.map((header, headerIndex) => [
        header,
        ...paddedRows.map((row) => row?.[headerIndex] ?? ''),
      ]);

  const renderTableHead = (items: ReactNode[]) => (
    <TableHead>
      <TableRow>
        {items.map((item, index) => (
          <TableCell key={`${item}-${index}`} variant="head">
            <Typography variant="subtitle2" fontWeight={600}>
              {item}
            </Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const renderTableBody = (tableRows: ReactNode[][]) => (
    <TableBody>
      {tableRows.map((row, rowIndex) => (
        <TableRow key={`row-${rowIndex}`}>
          {row.map((cell, cellIndex) => (
            <TableCell key={`cell-${rowIndex}-${cellIndex}`}>{cell}</TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );

  if (!hasData) {
    return (
      <Typography variant="body2" color="text.secondary">
        No data available.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        {!transpose && (
          <>
            {renderTableHead(headers)}
            {renderTableBody(paddedRows)}
          </>
        )}

        {transpose && (
          <>
            {renderTableHead(transposedHeaders)}
            {renderTableBody(transposedRows)}
          </>
        )}
      </Table>
    </TableContainer>
  );
};

export default TransposableTable;
