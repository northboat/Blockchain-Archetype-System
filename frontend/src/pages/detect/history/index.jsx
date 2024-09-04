import { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import {TextField} from '@mui/material';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';



const History = () => {
  const nav = useNavigate();
  const handleReturn = () => {
    // setOpen(true);
    nav('/detect');
  };

  // 朔源
  const handleTrace = (id, type) => {
    setIsOpen(true);
    const data = {"uni_id": id}
    console.log("溯源请求参数:")
    console.log(data);
    axios.post("/shit/trace/source", data)
      .then((res) => {
        console.log(res.data)
        if(!res.data.message){
          alert("溯源信息为空");
          return;
        } else if(res.data.message == "error uni_id"){
          alert("记录 id 不存在");
          return;
        } else if(res.data.message == "no uni_id"){
          alert("未传入 uni_id")
          return;
        }
        let info = res.data.message;
        let shit = info[0];
        let shits = shit.split('__');
        console.log(shits)
        let trace_info = {
          "errorType": type,
          "deviceType": shits[0].split("_")[1],
          "institution": shits[1].split("_")[1],
          "location": shits[2].split("_")[1],
          "mac": shits[3].split("_")[1],
          "oid": shits[4].split("_")[1],
          "path": info[1],
          "errorFlag": info[2],
          "ip": info[3]
        }
        setTraceInfo(trace_info);
      }).catch((e) => {
        console.log(e);
        alert("溯源失败")
      })
  }

  const [isOpen, setIsOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [traceInfo, setTraceInfo] = useState({});
  const handleClose = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    // setTraceInfo(TRACE_INFO);
    // setHistoryData(HISTORY_DATA);

    let ip = localStorage.getItem("ip");
    const data = {"id": ip}
    console.log("查询历史记录请求参数:")
    console.log(data)
    axios.post("/shit/detect/id", data)
      .then((res) => {
        console.log(res.data)
        if(!res.data.message){
          alert("设备历史信息为空");
        } else if(res.data.message == []){
          alert("无对应设备 IP")
          return;
        } else if(res.data.message == "no id"){
          alert("传入 IP 为空")
          return;
        }
        let list = res.data.message;
        let info = [];
        for(let i = 0; i < list.length; i++){
          let record = {};
          if(list[i][2] == '1'){
            record = { "id": list[i][0], "ip": ip, "time": list[i][1], "type": "1-异常行为"}
          } else if(list[i][2] == '2'){
            record = { "id": list[i][0], "ip": ip, "time": list[i][1], "type": "2-设备故障"}
          }
          info.push(record)
        }
        setHistoryData(info);
      }).catch((e) => {
        console.log(e);
        alert("获取设备历史信息失败")
      })
    // alert(ip)
    
  }, []);
  return (
    <>
      <div style={{ marginBottom: "10px" }}>
          <Button style={{ marginLeft: "5px" }} variant="contained" onClick={handleReturn}>返回</Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">设备 IP</TableCell>
              <TableCell align="center">时间</TableCell>
              <TableCell align="center">异常种类</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historyData.map((row) => (
              <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" align="center">{row.ip}</TableCell>
                <TableCell align="center">{row.time}</TableCell>
                <TableCell align="center">{row.type}</TableCell>
                <TableCell align="center">
                <Button variant="contained" onClick={() => handleTrace(row.id, row.type)}>溯源</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <Dialog onClose={handleClose} open={isOpen}>
        <DialogTitle>
          <span style={{ fontWeight: 800, fontSize: 18 }}>溯源服务</span>
        </DialogTitle>
        <Card sx={{ minWidth: 275 }}>
          <CardContent width={'60%'}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                设备标识: {traceInfo.oid}
              </Grid>
              <Grid item xs={6}>
                设备IP: {traceInfo.ip}
              </Grid>
              <Grid item xs={6}>
                设备类型: {traceInfo.deviceType}
              </Grid>
              <Grid item xs={6}>
                所属机构: {traceInfo.institution}
              </Grid>
              <Grid item xs={6}>
                设备物理位置: {traceInfo.location}
              </Grid>
              <Grid item xs={6}>
                网络设备地址: {traceInfo.mac}
              </Grid>
              <Grid item xs={12}>
                设备异常类别: {traceInfo.errorType}
              </Grid>
              <Grid item xs={12}>
                错误标识(sha256):
              </Grid>
              <Grid item xs={12}>
                <div style={{ marginLeft: '20px' }}>{traceInfo.errorFlag}</div>
              </Grid>
              <Grid item xs={12}>
                源路径:
              </Grid>
              <Grid item xs={12}>
                <div style={{ marginLeft: '20px' }}>{traceInfo.path}</div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Dialog>
    </>
  );
};

export default History;
