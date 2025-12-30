import { ConversionItem, ConversionStatus } from '@org/models';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import CheckIcon from '@mui/icons-material/Check';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import { useMemo, useState } from 'react';
import Status from './Status';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TransposableTable, {
  TransposableTableProps,
} from '../TransposableTable/TransposableTable';

type ConversionItemRowProps = {
  conversionItem: ConversionItem;
  isDeleteMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
};

const ConversionItemRow = ({
  conversionItem,
  isDeleteMode = false,
  isSelected = false,
  onToggleSelect,
}: ConversionItemRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const title = conversionItem.path.split('/').pop();

  const isSelectionDisabled =
    conversionItem.status === ConversionStatus.PENDING ||
    conversionItem.status === ConversionStatus.PROCESSING;

  const tableData = useMemo<Omit<TransposableTableProps, 'transpose'>>(() => {
    const {
      duration,
      stallCounter,
      createdAt,
      startedAt,
      updatedAt,
      erroredAt,
    } = conversionItem;

    const data = {
      headers: [
        'Duration',
        'Stall Counter',
        'Created At',
        'Started At',
        'Updated At',
      ],
      rows: [
        duration,
        stallCounter,
        createdAt,
        updatedAt,
        startedAt,
      ],
    };

    if (erroredAt) {
      data.headers.push('Errored At');
      data.rows.push(erroredAt);
    }

    return data;
  }, [conversionItem]);

  return (
    <>
      <TableRow
        key={conversionItem.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell>
          {isDeleteMode ? (
            <Checkbox
              checked={isSelected}
              disabled={isSelectionDisabled}
              onChange={() => onToggleSelect?.(conversionItem.id)}
            />
          ) : (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell component="th" scope="row">
          {title}
        </TableCell>
        <TableCell align="right">
          <Status
            status={conversionItem.status}
            progress={conversionItem.progress}
          />
        </TableCell>
        <TableCell align="right">{conversionItem.timeRemaining}</TableCell>
        <TableCell align="right">
          {conversionItem.is4k ? <CheckIcon fontSize={'large'} /> : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isExpanded && !isDeleteMode} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Info
              </Typography>
              <Divider />
              <TransposableTable
                transpose
                headers={tableData.headers}
                rows={tableData.rows}
              />
              {conversionItem.error && (
                <Box
                  maxHeight={'4rem'}
                  sx={{ overflowY: 'auto', overscrollBehaviorY: 'none' }}
                >
                  <Typography>Error:</Typography>
                  <Typography>{conversionItem.error}</Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ConversionItemRow;
