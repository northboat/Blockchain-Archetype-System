import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as React from 'react';
// material-ui
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';

// project import
import OrdersTable from './OrdersTable';
import IncomeAreaChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
import ReportAreaChart from './ReportAreaChart';
import SalesColumnChart from './SalesColumnChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
// assets
import { GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

import { detectResultService, detectResultListService, detectAllService } from 'api/detect';



// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// sales report status
const status = [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'month',
    label: 'This Month'
  },
  {
    value: 'year',
    label: 'This Year'
  }
];

// ==============================|| DASHBOARD - DEFAULT ||============================== //





export const Detect = () => {
  const [value, setValue] = useState('today');
  const [slot, setSlot] = useState('week');
  const [totalInfo, setTotalInfo] = useState({});

  
  useEffect(() => {
    // TOTAL_INFO.checkNum += 500
    // alert("test")
    // setTotalInfo(TOTAL_INFO);
    let total_info = {
      checkNum: null,
      errorNum: null,
      brokenNum: null
    };
    // detect/all
    detectAllService()
    .then((res) => {
      if(!res.message){
        alert("请求数据为空");
        return;
      }
      total_info.checkNum = res.message[0];
      total_info.errorNum = res.message[1];
      total_info.brokenNum = res.message[2];
      console.log(total_info);
      setTotalInfo(total_info);
    }).catch((e) => {
      alert("请求数据总计失败")
    })
  }, []);
  
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">数据总计</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <AnalyticEcommerce title="共检测次数" count={`${totalInfo.checkNum}次`} color="linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <AnalyticEcommerce title="异常行为" count={`${totalInfo.errorNum}次`} color="linear-gradient(120deg, #f093fb 0%, #f5576c 100%)" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <AnalyticEcommerce title="设备故障" count={`${totalInfo.brokenNum}次`} color="linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)" />
      </Grid>
      
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      {/* 数据记录和设备异常情况，写在IncomeAreaChart.js里 */}
      <IncomeAreaChart slot={slot} />
      

      {/* row 3 */}
      {/* 设备信息，写在OrdersTable.js里 */}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">设备信息</Typography>
          </Grid>
          <Grid item />
        </Grid>

        {/* <div style={{ marginTop: "20px" }}>
          <TextField
            style={{ marginLeft: "1%" }}
            sx={{ width: '40%' }}
            value={deviceIP}
            onChange={(e) => setDeviceIP(e.target.value)}
            fullWidth
            id="outlined-basic"
            label="查看历史记录, 请输入设备 IP"
            variant="outlined"
            margin="normal"
          />
          <Button style={{ marginTop: "17px", marginLeft: "5px"}} variant="contained" onClick={handleOpen}>查询记录</Button>
        </div> */}

        <MainCard sx={{ mt: 2 }} content={false}>          
          <OrdersTable />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default Detect;
