import './app.css';
import { useConversionItemsQuery } from './hooks/api/useConversionItemsQuery';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ConversionItemRow from './ConversionItemRow/ConversionItemRow';
import Box from '@mui/material/Box';

export function App() {

  const { data } = useConversionItemsQuery()

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Optimal Video Encoder</h1>
        </div>
      </header>
      <main className="app-main">
        <Box mx={10} mt={2}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell/>
              <TableCell>Title</TableCell>
              <TableCell align="right">Status</TableCell>
                <TableCell align="right">Time Remaining</TableCell>
                <TableCell align="right">4k</TableCell>
                {/*<TableCell align="right">duration</TableCell>*/}
                {/*<TableCell align="right">error</TableCell>*/}
                {/*<TableCell align="right">{conversionItem?.startedAt}</TableCell>*/}
                {/*<TableCell align="right">{conversionItem.erroredAt}</TableCell>*/}
                {/*<TableCell align="right">{conversionItem.deletedAt}</TableCell>*/}
                {/*<TableCell align="right">{conversionItem.createdAt}</TableCell>*/}
                {/*<TableCell align="right">{conversionItem.updatedAt}</TableCell>*/}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.map((ci) => (
                <ConversionItemRow conversionItem={ci}/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </Box>
      </main>
    </div>
  );
}

export default App;
