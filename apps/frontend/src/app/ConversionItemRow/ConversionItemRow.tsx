import { ConversionItem } from '@org/models';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

type ConversionItemRowProps = {
  conversionItem: ConversionItem;
};

const ConversionItemRow = ({ conversionItem }: ConversionItemRowProps) => {
  return (
    <TableRow
      key={conversionItem.id}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {conversionItem.path}
      </TableCell>
      <TableCell align="right">{conversionItem.id}</TableCell>
      <TableCell align="right">{conversionItem.progress}</TableCell>
      <TableCell align="right">{conversionItem.timeRemaining}</TableCell>
      <TableCell align="right">{conversionItem.duration}</TableCell>
      <TableCell align="right">{conversionItem.is4k}</TableCell>
      <TableCell align="right">{conversionItem.error}</TableCell>
      <TableCell align="right">{conversionItem.status}</TableCell>
      <TableCell align="right">{conversionItem.stallCounter}</TableCell>
      {/*<TableCell align="right">{conversionItem?.startedAt}</TableCell>*/}
      {/*<TableCell align="right">{conversionItem.erroredAt}</TableCell>*/}
      {/*<TableCell align="right">{conversionItem.deletedAt}</TableCell>*/}
      {/*<TableCell align="right">{conversionItem.createdAt}</TableCell>*/}
      {/*<TableCell align="right">{conversionItem.updatedAt}</TableCell>*/}
    </TableRow>
  );
};

export default ConversionItemRow;
