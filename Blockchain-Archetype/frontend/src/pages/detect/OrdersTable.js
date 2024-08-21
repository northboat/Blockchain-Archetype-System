import PropTypes from 'prop-types';
import { useState, React, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import { Box, TextField, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Button } from '@mui/material';
// third-party
import NumberFormat from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { detectResultService, detectResultListService, detectAllService } from 'api/detect';


function createData(deviceId, errorNum, brokenNum) {
  return { deviceId, errorNum, brokenNum };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
  {
    id: 'deviceId',
    align: 'center',
    disablePadding: false,
    label: '设备 IP'
  },
  {
    id: 'errorNum',
    align: 'center',
    disablePadding: true,
    label: '异常次数'
  },
  {
    id: 'brokenNum',
    align: 'center',
    disablePadding: false,
    label: '故障次数'
  },
  {
    id: 'operation',
    align: 'center',
    disablePadding: false,
    label: '操作'
  },
  
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string
};

// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Pending';
      break;
    case 1:
      color = 'success';
      title = 'Approved';
      break;
    case 2:
      color = 'error';
      title = 'Rejected';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.number
};

// ==============================|| ORDER TABLE ||============================== //

const DEVICE_INFO = [
  createData('119.128.118.237', 29, 14),
  createData('7.109.218.242', 37, 9),
  createData('216.107.50.60', 13, 4),
  createData('116.6.201.204', 7, 6),
  createData('50.85.219.84', 57, 28)
];

export default function OrderTable() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const [deviceInfos, setDeviceInfos] = useState([]);
  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  const nav = useNavigate();
  const handleOpen = (ip) => {
    // setOpen(true);
    // console.log(ip)
    localStorage.setItem("ip", ip);
    nav('/history');
  };

  useEffect(() => {
    setDeviceInfos(DEVICE_INFO);
    // detect/resultlist
    detectResultListService()
      .then((res) => {
        if(!res.message){
          alert("请求数据为空");
          return;
        }
        let map = res.message;
        let device = [];
        for(let i of Object.keys(map)){
          let ip = i;
          let error = map[ip][0];
          let broken = map[ip][1];
          device.push(createData(ip, error, broken));
        }
        console.log(device)
        setDeviceInfos(device);
        // DEVICE_INFO = DEVICE;
        // setDeviceInfos(DEVICE_INFO);
      }).catch((e) =>  {
        alert("请求设备信息失败")
      })
  }, []);
  return (
    <>    
      <Box>
        <TableContainer
          sx={{
            width: '100%',
            overflowX: 'auto',
            position: 'relative',
            display: 'block',
            maxWidth: '100%',
            '& td, & th': { whiteSpace: 'nowrap' }
          }}
        >
          <Table
            aria-labelledby="tableTitle"
            sx={{
              '& .MuiTableCell-root:first-of-type': {
                pl: 2
              },
              '& .MuiTableCell-root:last-of-type': {
                pr: 3
              }
            }}
          >
            <OrderTableHead order={order} orderBy={orderBy} />
            <TableBody>
              {stableSort(deviceInfos, getComparator(order, orderBy)).map((row, index) => {
                const isItemSelected = isSelected(row.trackingNo);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <>
                    <TableRow
                      hover
                      role="checkbox"
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row}
                      selected={isItemSelected}
                    >
                      <TableCell component="th" id={labelId} scope="row" align="center">
                        {row.deviceId}
                      </TableCell>
                      <TableCell align="center">{row.errorNum}</TableCell>
                      <TableCell align="center">{row.brokenNum}</TableCell>
                      <TableCell align="center">
                        <Button variant="contained" onClick={() => handleOpen(row.deviceId)}>查询</Button>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
