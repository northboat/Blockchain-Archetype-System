import * as React from 'react';
import { createPortal } from 'react-dom';
import { styled } from '@mui/material/styles';
import { FormControl, Box, Grid, Card, CardContent, Typography, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, InputLabel, Select, MenuItem} from '@mui/material'



import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';

const MENU = {
  "Adomain":{
    "domainList": [ "Alicefile0", "Alicefile3" ]
  },
  "Bdomain":{
    "domainList": [ "Bobfile0" ]
  },
}

const FILEUPLOADPARAMS = {
  filename: 'file0',
  content: 'This is the content.',
  accesstree: '((2 AND 4) OR 6)'
};

import { fileCrossDomainDlService, fileInDomainDlService, fileOutSourceService, fileUploadService } from 'api/file';
import { domainAttrService, domainMapService } from 'api/domain'

const AccessControl = () => {
  // 下载成功的消息弹窗显示
  const [isMsgShow, setIsMsgShow] = React.useState(false);
  const [msgContent, setMsgContent] = React.useState(false);
  const handleMsgShow = (e) => {
    setMsgContent(e);
    setIsMsgShow(true);
    setTimeout(() => { setIsMsgShow(false); }, 3000);
  }
  // 文件上传弹窗
  const [isUploadShow, setIsUploadShow] = React.useState(false);
  const [fileUploadParams, setFileUploadParams] = React.useState(FILEUPLOADPARAMS);
  const setFileName = (val) => setFileUploadParams({ ...fileUploadParams, filename: val });
  const setContent = (val) => setFileUploadParams({ ...fileUploadParams, content: val });
  const setAccessTree = (val) => setFileUploadParams({ ...fileUploadParams, accesstree: val });


  const handleFileUpload = () => {

    // 前端维护的文件列表
    // console.log(MENU);
    // let domain = localStorage.getItem("domain");
    // console.log(domain)
    // // console.log(MENU[domain]["domainList"])
    // for(let i = 0; i < MENU[domain]["domainList"].length; i++){
    //   console.log(MENU[domain]["domainList"][i]);
    // }

    const data = {
      ...fileUploadParams,
      username: localStorage.getItem('username') || '',
      domain: localStorage.getItem('domain') || ''
    };
    console.log("文件上传请求参数:")
    console.log(data)
    fileUploadService(data)
      .then((res) => {
        if (res.code === '200') {
          setIsUploadShow(false);
          handleMsgShow("文件上传成功")
        } else {
          setIsUploadShow(false);
          handleMsgShow("文件上传失败")
        }
      })
      .catch((e) => {
        // console.log("nmsl")
        console.log(e);
        setIsUploadShow(false);
        handleMsgShow(e.message)
      });
  };


  // 文件下载
  const FILEDOWNLOADPARAMS = {
    filename: 'Alicefile0',
    onwer: 'Alice',
    localdomain: localStorage.getItem("domain"),
    targetdomain: "Bdomain"
  };
  const [isDownloadShow, setIsDownloadShow] = React.useState(false);
  const [fileDownloadParams, setFileDownloadParams] = React.useState(FILEDOWNLOADPARAMS);


  const handleFileUploadClose = () => {
    // setFileUploadParams(FILEUPLOADPARAMS);
    setIsUploadShow(false);
  };

  // 文件下载，包括域内下载和跨域下载
  const handleFileDownload = () => {
    let type = fileDownloadParams.localdomain != fileDownloadParams.targetdomain
    if (type == 0) {
      const data = {
        filename: fileDownloadParams.filename,
        username: localStorage.getItem('username') || '' // fileDownloadParams里的username被这里盖过去了，用owner代替
      };
      console.log("域内下载请求参数:")
      console.log(data)
      fileInDomainDlService(data)
        .then((res) => {
          if (res.code === '200') {
            setIsDownloadShow(false);
            handleMsgShow("文件下载成功");
          } else {
            setIsDownloadShow(false);
            handleMsgShow("文件下载失败");
          }
        })
        .catch((e) => {
          setIsDownloadShow(false);
          console.log(e);
          handleMsgShow(e.message);
        });
    } else if (type == 1) { // 跨域下载
      const data = {
        filename: fileDownloadParams.filename,
        username: localStorage.getItem('username') || '',
        localdomain: fileDownloadParams.localdomain,
        targetdomain: fileDownloadParams.targetdomain
      };
      console.log("跨域下载请求参数:")
      console.log(data)
      fileCrossDomainDlService(data)
        .then((res) => {
          if (res.code === '200') {
            setIsDownloadShow(false);
            handleMsgShow('文件跨域下载成功');
          } else {
            setIsDownloadShow(false);
            handleMsgShow("文件下载失败");
          }
        })
        .catch((e) => {
          setIsDownloadShow(false);
          console.log(e);
          handleMsgShow(e.message);
        });
    }
  };
  const handleFileDownloadClose = () => {
    // setFileDownloadParams({});
    setIsDownloadShow(false);
  };


  // 外包订阅
  const [isOutSourceShow, setIsOutSourceShow] = React.useState(false);
  const [outSourceParams, setOutSourceParams] = React.useState({
    username: 'Alice',
    // key_csp: localStorage.getItem('Key_CSP') || 'null'
  });
  const handleOutSourceClose = () => {
    setIsOutSourceShow(false);
    // setOutSourceParams({});
  };
  const handleOutSource = () => {
    const data = {
      ...outSourceParams
    };
    console.log("外包订阅请求参数:")
    console.log(data);
    fileOutSourceService(data)
      .then((res) => {
        setIsOutSourceShow(false);
        console.log(res)
        handleMsgShow(res.result);
      })
      .catch((e) => {
        console.log(e);
        setIsOutSourceShow(false);
        handleMsgShow(e.message);
      });
  };


  // 设置属性列表
  const [isAttributesetShow, setIsAttributesetShow] = React.useState(false);
  const [attributesetParams, setAttributesetParams] = React.useState({
    domainname: 'Adomain',
    domainAttListString: '(1,2,3,4,5,6,7)'
  });
  const handleAttributesetClose = () => {
    setIsAttributesetShow(false);
    // setAttributesetParams({});
  }
  const handleAttributesetSet = () => {
    const data = {
      ...attributesetParams
    };
    console.log("设置属性列表请求参数:")
    console.log(data);
    domainAttrService(data)
      .then((res) => {
        setIsAttributesetShow(false);
        handleMsgShow(res.result);
      })
      .catch((e) => {
        console.log(e);
        setIsAttributesetShow(false);
        handleMsgShow(e.message);
      });
  }


  // 修改属性映射矩阵
  const [isMapSetShow, setIsMapSetShow] = React.useState(false);
  const [mapSetParams, setMapSetParams] = React.useState({
    localname: 'Adomain',
    targetname: 'Bdomain',
    map: '((0, 0, 0, 1, 0, 0),\n(1, 1, 0, 0, 0, 0),\n(0, 1, 0, 0, 0, 0),\n(0, 0, 0.5, 0.5, 0, 0),\n(0, 0, 0, 0, 1, 0),\n(0.34, 0, 0, 0, 0.34, 0.34),\n(0, 0, 0, 0, 0, 0))'
  });
  const handleMapSetClose = () => {
    setIsMapSetShow(false);
    // setMapSetParams({});
  };
  const handleMapSet = () => {
    const data = {
      ...mapSetParams
    };    
    data.map = data.map.replace(/[\r\n]/g, " "); // 去掉map中的换行符，/g:代表全字符匹配
    console.log("修改属性映射矩阵请求参数:")
    console.log(data);
    domainMapService(data)
      .then((res) => {
        setIsMapSetShow(false);
        handleMsgShow(res.result);
      })
      .catch((e) => {
        console.log(e);
        setIsMapSetShow(false);
        handleMsgShow(e.message);
      });
  }


  
  const [options, setOptions] = React.useState(MENU[fileDownloadParams.targetdomain]["domainList"]);

  return (
    <>
      {/* 消息提示弹窗 */}
      <Snackbar
        message={msgContent}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isMsgShow}
        autoHideDuration={6000}
      ></Snackbar>
      
      {/* 文件上传弹窗 */}
      <Dialog onClose={handleFileUploadClose} open={isUploadShow}>
        <DialogTitle style={{ fontSize:'20px' }}>文件上传</DialogTitle>
        <DialogContent style={{ minWidth:"500px"}}>
          <DialogContentText style={{ marginBottom:"20px" }}>请输入文件名、文件内容、访问结构</DialogContentText>
          <TextField
            value={fileUploadParams.filename}
            onChange={(e) => setFileUploadParams({ ...fileUploadParams, filename: e.target.value })}
            fullWidth
            multiline
            placeholder="请输入文件名"
            label="文件名"
            id="fullWidth"
            variant="outlined"
            margin="normal"
          />
          <TextField
            value={fileUploadParams.content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={5}
            placeholder="请输入文件内容"
            label="文件内容"
            id="fullWidth"
            variant="outlined"
            margin="normal"
          />
          <TextField
            value={fileUploadParams.accesstree}
            onChange={(e) => setAccessTree(e.target.value)}
            fullWidth
            id="outlined-basic"
            label="访问结构"
            placeholder="请输入访问结构，参考格式：((2 AND 4) OR 6)"
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFileUploadClose}>取消</Button>
          <Button type="submit" onClick={handleFileUpload}>上传</Button>
        </DialogActions>
      </Dialog>



      {/* 文件下载弹窗，包括域内下载和域外下载 */}
      <Dialog onClose={handleFileDownloadClose} open={isDownloadShow}>
        <DialogTitle style={{ fontSize:"20px" }} >文件下载：域内下载 / 跨域下载</DialogTitle>
        <DialogContent style={{ minWidth:"500px"}}>
          <DialogContentText style={{ marginBottom:"10px" }}>请选择目标域以及文件名，系统将根据目标域自动识别是否跨域</DialogContentText>

          <TextField
            style={{ marginBottom:"20px" }} 
            value={localStorage.getItem("domain")}
            fullWidth
            InputProps={{
              readOnly: true
            }}
            id="outlined-basic"
            label="本地域"
            variant="outlined"
            margin="normal"
          />
          <FormControl style={{ marginRight:"6%", minWidth:"47%" }}>
            <InputLabel id="demo-simple-select-autowidth-label">目标域</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              onChange={(e) => {
                setFileDownloadParams({ ...fileDownloadParams, targetdomain: e.target.value })
                setOptions(MENU[e.target.value]["domainList"])
              }}
              autoWidth
              placeholder="目标域"
            >
            {Object.keys(MENU).map((key, index) => (
              <MenuItem key={index} value={key}>
                {key}
              </MenuItem>
            ))}
            </Select>
          </FormControl>

          <FormControl style={{ minWidth:"47%" }}>
            <InputLabel id="demo-simple-select-autowidth-label">选择文件</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              onChange={(e) => setFileDownloadParams({ ...fileDownloadParams, filename: e.target.value })}
              autoWidth
              placeholder="文件名"
            >
            {options.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
            </Select>
          </FormControl>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFileDownloadClose}>取消</Button>
          <Button type="submit" onClick={handleFileDownload}>下载</Button>
        </DialogActions>
      </Dialog>


      {/* 订阅外包服务弹窗 */}
      <Dialog onClose={handleOutSourceClose} open={isOutSourceShow}>
        <DialogTitle sx={{ fontSize: '20px' }}>订阅外包服务</DialogTitle>
        <DialogContent style={{ minWidth:"350px"}}>
          <DialogContentText style={{ marginBottom:"10px" }}>请输入需要订阅的用户名</DialogContentText>
          <TextField
            value={outSourceParams.username}
            onChange={(e) => setOutSourceParams({ ...outSourceParams, username: e.target.value })}
            fullWidth
            id="outlined-basic"
            label="文件所属用户名"
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOutSourceClose}>取消</Button>
          <Button type="submit" onClick={handleOutSource}>
            订阅外包服务
          </Button>
        </DialogActions>
      </Dialog>




      {/* 设置属性列表 */}
      <Dialog onClose={handleAttributesetClose} open={isAttributesetShow}>
        <DialogTitle sx={{ fontSize: '20px' }}>设置属性列表</DialogTitle>
        <DialogContent style={{ minWidth:"400px"}}>
          <DialogContentText>请输入域名以及属性列表</DialogContentText>
          <TextField
            value={attributesetParams.domainname}
            onChange={(e) => setAttributesetParams({ ...attributesetParams, domainname: e.target.value })}
            fullWidth
            id="outlined-basic"
            label="域名"
            variant="outlined"
            margin="normal"
          />
          <TextField
            value={attributesetParams.domainAttListString}
            onChange={(e) => setAttributesetParams({ ...attributesetParams, domainAttListString: e.target.value })}
            fullWidth
            id="outlined-basic"
            label="属性列表"
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAttributesetClose}>取消</Button>
          <Button type="submit" onClick={handleAttributesetSet}>设置属性列表</Button>
        </DialogActions>
      </Dialog>


      {/* 修改属性映射矩阵 */}
      <Dialog onClose={handleMapSetClose} open={isMapSetShow}>
        <DialogTitle sx={{ fontSize: '20px' }}>修改属性映射矩阵</DialogTitle>
        <DialogContent style={{ minWidth:"600px" }}>
          <DialogContentText>请输入目标域以及映射矩阵</DialogContentText>
          <TextField
            style={{ marginBottom:"20px" }}
            value={localStorage.getItem("domain")}
            fullWidth
            id="outlined-basic"
            label="本地域"
            variant="outlined"
            margin="normal"
            InputProps={{
              readOnly: true
            }}
          />
          <FormControl style={{ minWidth:"47%", marginBottom:"7px" }}>
            <InputLabel id="demo-simple-select-autowidth-label">目标域</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              onChange={(e) => setMapSetParams({ ...mapSetParams, targetname: e.target.value })}
              autoWidth
              placeholder="目标域"
            >
            {Object.keys(MENU).map((key, index) => (
              <MenuItem key={index} value={key}>
                {key}
              </MenuItem>
            ))}
            </Select>
          </FormControl>
          <TextField
            value={mapSetParams.map}
            onChange={(e) => setMapSetParams({ ...mapSetParams, map: e.target.value })}
            fullWidth
            id="outlined-basic"
            label="映射矩阵"
            variant="outlined"
            margin="normal"
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMapSetClose}>取消</Button>
          <Button type="submit" onClick={handleMapSet}>修改属性映射矩阵</Button>
        </DialogActions>
      </Dialog>




      <Box sx={{ flexGrow: 1, paddingTop: '50px' }}>
        <Grid container spacing={5}>
          <Grid item xs={6}>
            <Card sx={{ minWidth: 200, minHeight: 140, cursor: 'pointer' }}>
              <CardContent onClick={() => setIsUploadShow(true)}>
                <Typography variant="h3" component="div">
                  文件上传
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  功能介绍
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card sx={{ minWidth: 200, minHeight: 140, cursor: 'pointer' }}>
              <CardContent onClick={() => {setIsDownloadShow(true)}}>
                <Typography variant="h3" component="div">
                  文件下载
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  功能介绍
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={10}>
            <Card sx={{ minWidth: 200, minHeight: 140, cursor: 'pointer' }}>
              <CardContent onClick={() => {setIsOutSourceShow(true)}}
                // onClick={() => {
                //   if (!localStorage.getItem('Key_CSP')) {
                //     setMsgContent('未完成密钥协商');
                //     setIsMsgShow(true);
                //     setTimeout(() => {
                //       setIsMsgShow(false);
                //     }, 3000);
                //     return;
                //   }
                //   setIsOutSourceShow(true);
                // }}
              >
                <Typography variant="h3" component="div">
                  订阅外包服务
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  功能介绍
                </Typography>
              </CardContent>
            </Card>
          </Grid>


          <Grid item xs={10}>
            <Card sx={{ minWidth: 200, minHeight: 140, cursor: 'pointer' }}>
              <CardContent onClick={() => {setIsAttributesetShow(true)}}>
                <Typography variant="h3" component="div">
                  设置属性列表
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  功能介绍
                </Typography>
              </CardContent>
            </Card>
          </Grid>


          <Grid item xs={10}>
            <Card sx={{ minWidth: 200, minHeight: 120, cursor: 'pointer' }}>
              <CardContent onClick={() => {setIsMapSetShow(true)}}>
                <Typography variant="h3" component="div">
                  修改属性映射矩阵
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  功能介绍
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AccessControl;
