import * as React from 'react';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { getKeyService } from 'api/file';
import Snackbar from '@mui/material/Snackbar';

// keyA: '0x43 0x57 0xF0 0xF6 ... 0xA7 (11280 bytes)',
// keyB: '0xCB 0x80 0xA5 0x4E ... 0x1E (11280 bytes)',
// sessionB: '82618317DF26BC6E96CE77F43CC340E11D8361C3',
// funcB: '0xFE 0xD7 0xE6 0xF0 0x0D 0x1A 0x10'
const USERINFO = {
  keyA: '',
  keyB: '',
  sessionB: '',
  funcB: ''
};

// sessionID: 'AB1',
// hash: '67568957da7414c22dc8438a64986f82ecc9cd03d8fc2ed840cfe11cd93e24fb'
const USERB = {
  sessionID: '',
  hash: ''
};

// sessionKey: '82618317DF26BC6E96CE77F43CC340E11D8361C3',
// sessionID: 'AB1',
// hash: '67568957da7414c22dc8438a64986f82ecc9cd03d8fc2ed840cfe11cd93e24fb',
// storage: '67568957da7414c22dc8438a64986f82ecc9cd03d8fc2ed840cfe11cd93e24fb'
const USERA = {
  sessionKey: '',
  sessionID: '',
  hash: '',
  storage: ''
};

const ERROR_CODE = 500;
const SUCCESS_CODE = 200;

const KeyAgreement = () => {

  

  // 下载成功的消息弹窗显示
  const [isMsgShow, setIsMsgShow] = React.useState(false);
  const [msgContent, setMsgContent] = React.useState(false);
  const handleMsgShow = (e) => {
    setIsMsgShow(false);
    setMsgContent(e);
    setIsMsgShow(true);
    setTimeout(() => { setIsMsgShow(false); }, 3000);
  }

  const [userInfo, setUserInfo] = useState(USERINFO);
  const [userA, setUserA] = useState(USERA);
  const [userB, setUserB] = useState(USERB);

  const [resultCode, setResultCode] = useState(ERROR_CODE);

  const sleep = (d) => {
    for(var t = Date.now();Date.now() - t <= d;);
  }

  const getUserInfo = () => {
    getKeyService()
      .then((res) => {
        // eslint-disable-next-line
        const {
          'public_A': keyA,
          'public_B': keyB,
          'key_B': sessionB,
          'rec': funcB
        } = res.data;
        USERINFO.keyA = keyA;
        USERINFO.keyB = keyB;
        USERINFO.sessionB = sessionB;
        USERINFO.funcB = funcB;
        handleMsgShow("获取成功");
        setUserInfo(USERINFO);
        
        const {
          'sessionID': sessionID,
          'hash': hash
        } = res.data;
        USERB.hash = hash;
        USERB.sessionID = sessionID;
        setUserB(USERB);

        const {
          'key_B': sessionKey,
          'hash': storage
        } = res.data;
        USERA.sessionKey = sessionKey;
        USERA.storage = storage;
        USERA.sessionID = sessionID;
        USERA.hash = hash;
        setUserA(USERA);

      })
      .catch((e) => {
        console.log(e);
        handleMsgShow(e.message);
      });
  };

 

  return (
    <>
      <Snackbar
        message={msgContent}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isMsgShow}
        autoHideDuration={6000}
      ></Snackbar>
      <Card sx={{ minWidth: 275, mb: '10px', position: 'relative' }} variant="outlined">
        <CardContent>
          <Divider>用户的基本密钥信息</Divider>
          <div style={{ display: 'flex', alignItems: 'baseline', height: '50px' }}>
            <span>用户A的公钥&emsp;</span>
            <TextField
              sx={{ width: '40%' }}
              value={userInfo.keyA}
              InputProps={{
                readOnly: true
              }}
              variant="standard"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', height: '50px' }}>
            <span>用户B的公钥&emsp;</span>
            <TextField
              sx={{ width: '40%' }}
              value={userInfo.keyB}
              InputProps={{
                readOnly: true
              }}
              variant="standard"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', height: '50px' }}>
            <span>用户B的会话密钥&emsp;</span>
            <TextField
              sx={{ width: '40%' }}
              value={userInfo.sessionB}
              InputProps={{
                readOnly: true
              }}
              variant="standard"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span>用户B的生成协调函数值&emsp;</span>
            <TextField
              sx={{ width: '40%' }}
              value={userInfo.funcB}
              InputProps={{
                readOnly: true
              }}
              variant="standard"
            />
          </div>

          <CardActions style={{ position: 'absolute', top: '50%', right: '10%' }}>
            <Button variant="contained" onClick={getUserInfo}>
              获取值
            </Button>
          </CardActions>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 275, mb: '10px', position: 'relative' }} variant="outlined">
        <CardContent>
          <Divider>用户B存储值</Divider>
          <div style={{ display: 'flex', alignItems: 'baseline', height: '50px' }}>
            <span>用户B存储值sessionID&emsp;</span>
            <TextField
              sx={{ width: '40%' }}
              value={userB.sessionID}
              InputProps={{
                readOnly: true
              }}
              variant="standard"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', height: '30px' }}>
            <span>用户B存储值hash&emsp;</span>
            <TextField
              sx={{ width: '50%' }}
              value={userB.hash}
              InputProps={{
                readOnly: true
              }}
              variant="standard"
            />
          </div>
        </CardContent>
        
      </Card>
      <Card sx={{ minWidth: 275, mb: '10px', position: 'relative' }} variant="outlined">
        <CardContent>
          <Divider>用户A获取并计算</Divider>
          <div style={{ display: 'flex', alignItems: 'baseline', height: '50px' }}>
            <span>用户A的会话密钥&emsp;</span>
            <TextField
              sx={{ width: '40%' }}
              value={userA.sessionKey}
              InputProps={{
                readOnly: true
              }}
              variant="standard"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', height: '50px' }}>
            <span>用户A获取存储值sessionID&emsp;</span>
            <TextField
              sx={{ width: '40%' }}
              value={userA.sessionID}
              InputProps={{
                readOnly: true
              }}
              variant="standard"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', height: '50px' }}>
            <span>用户A获取存储值hash&emsp;</span>
            <TextField
              sx={{ width: '50%' }}
              value={userA.hash}
              InputProps={{
                readOnly: true
              }}
              variant="standard"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', height: '30px' }}>
            <span>用户A计算存储值&emsp;</span>
            <TextField
              sx={{ width: '50%' }}
              value={userA.storage}
              InputProps={{
                readOnly: true
              }}
              variant="standard"
            />
          </div>
        </CardContent>
      </Card>
      {/* <Card sx={{ minWidth: 275 }} variant="outlined">
        <CardContent>
          <Divider>结果</Divider>
          <div style={{ display: 'flex', alignItems: 'baseline', height: '50px' }}>
            <span>输出状态码：</span>
            <TextField
              sx={{ width: '40%' }}
              value={resultCode}
              InputProps={{
                readOnly: true
              }}
              variant="standard"
            />
          </div>
        </CardContent>
      </Card> */}
    </>
  );
};

export default KeyAgreement;
