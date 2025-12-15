import { ConversionItem } from '@org/models';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import CheckIcon from '@mui/icons-material/Check';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import Status from './Status';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';

type ConversionItemRowProps = {
  conversionItem: ConversionItem;
};

const ConversionItemRow = ({ conversionItem }: ConversionItemRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const title = conversionItem.path.split('/').pop();

  // <TableCell align="right">{conversionItem.duration}</TableCell>
  // <TableCell align="right">{conversionItem.stallCounter}</TableCell>
  // {/*<TableCell align="right">{conversionItem?.startedAt}</TableCell>*/}
  // {/*<TableCell align="right">{conversionItem.erroredAt}</TableCell>*/}
  // {/*<TableCell align="right">{conversionItem.deletedAt}</TableCell>*/}
  // {/*<TableCell align="right">{conversionItem.createdAt}</TableCell>*/}
  // {/*<TableCell align="right">{conversionItem.updatedAt}</TableCell>*/}

  return (
    <>
      <TableRow
        key={conversionItem.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
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
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Info
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/*{row.history.map((historyRow) => (*/}
                  {/*  <TableRow key={historyRow.date}>*/}
                  {/*    <TableCell component="th" scope="row">*/}
                  {/*      {historyRow.date}*/}
                  {/*    </TableCell>*/}
                  {/*    <TableCell>{historyRow.customerId}</TableCell>*/}
                  {/*    <TableCell align="right">{historyRow.amount}</TableCell>*/}
                  {/*    <TableCell align="right">*/}
                  {/*      {Math.round(historyRow.amount * row.price * 100) / 100}*/}
                  {/*    </TableCell>*/}
                  {/*  </TableRow>*/}
                  {/*))}*/}
                </TableBody>
              </Table>
              {conversionItem.error &&(
                <Box maxHeight={"4rem"} sx={{overflowY: "auto", overscrollBehaviorY:"none"}}>
                  <Typography>Error:</Typography>
                  <Typography>{conversionItem.error}</Typography>
                </Box>)
              }
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ConversionItemRow;
