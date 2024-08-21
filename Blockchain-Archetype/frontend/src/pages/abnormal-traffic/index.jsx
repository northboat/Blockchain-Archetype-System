import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';

const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

function createData(ip, abnormalNum, breakNum) {
  return { ip, abnormalNum, breakNum, operation: 1 };
}

const rows = [
  createData('127.0.0.1', 120, 72),
  createData('127.0.0.1', 237, 9.0),
  createData('127.0.0.1', 262, 16.0),
  createData('127.0.0.1', 305, 3.7),
  createData('127.0.0.1', 356, 16.0)
];

const AbnormalTraffic = () => {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <Card sx={{ minWidth: 275, minHeight: 300 }} style={{ flex: 1, marginRight: '40px' }}>
            <CardContent>
              <Typography sx={{ fontSize: 18 }} color="black" gutterBottom style={{ textAlign: 'center' }}>
                设备异常情况
              </Typography>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 10, label: '正常' },
                      { id: 1, value: 15, label: '异常行为' },
                      { id: 2, value: 20, label: '设备故障' }
                    ],
                    highlightScope: { faded: 'global', highlighted: 'item' }
                  }
                ]}
                width={400}
                height={200}
              />
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 275, minHeight: 300 }} style={{ flex: 1 }}>
            <CardContent>
              <div style={{ display: 'flex', width: '100%', margin: '60px auto' }}>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', marginRight: '10px' }}>
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '100%',
                      backgroundImage: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
                      borderRadius: '50%'
                    }}
                  >
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      设备故障
                      <h3>1024次</h3>
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', marginRight: '10px' }}>
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '100%',
                      backgroundImage: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
                      borderRadius: '50%'
                    }}
                  >
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      异常行为
                      <h3>128次</h3>
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '100%',
                      backgroundImage: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
                      borderRadius: '50%'
                    }}
                  >
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      设备故障
                      <h3>72次</h3>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div style={{ display: 'flex' }}>
          <Card sx={{ minWidth: 400, minHeight: 300 }} style={{ flex: 3, marginRight: '40px' }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 50 }} aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">设备ID</StyledTableCell>
                        <StyledTableCell align="center">异常次数</StyledTableCell>
                        <StyledTableCell align="center">故障次数</StyledTableCell>
                        <StyledTableCell align="center">操作</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <StyledTableRow key={row}>
                          <StyledTableCell component="th" scope="row">
                            {row.ip}
                          </StyledTableCell>
                          <StyledTableCell align="center">{row.abnormalNum}</StyledTableCell>
                          <StyledTableCell align="center">{row.breakNum}</StyledTableCell>
                          <StyledTableCell align="center">
                            <Button variant="outlined" size="small" onClick={toggleDrawer('right', true)}>
                              历史数据
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 275, minHeight: 300 }} style={{ flex: 2 }}>
            <CardContent>
              <Typography sx={{ fontSize: 18 }} color="black" gutterBottom style={{ textAlign: 'center' }}>
                数据记录
              </Typography>
              <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10, 12, 15, 16] }]}
                series={[
                  {
                    data: [2, 5.5, 2, 8.5, 1.5, 5],
                    valueFormatter: (value) => (value == null ? 'NaN' : value.toString())
                  },
                  {
                    data: [null, null, null, null, 5.5, 2, 8.5, 1.5, 5]
                  },
                  {
                    data: [7, 8, 5, 4, null, null, 2, 5.5, 1],
                    valueFormatter: (value) => (value == null ? '?' : value.toString())
                  }
                ]}
                height={300}
                margin={{ top: 10, bottom: 20 }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AbnormalTraffic;
