```js
// console.log("进来了2")
fileCrossDomainDlService(data)
    .then((res) => {
    if (res.code === '200') {
        setIsDownloadShow(false);
        setMsgContent('文件跨域下载成功');
        setIsMsgShow(true);
        setTimeout(() => { setIsMsgShow(false); }, 3000);
    } else {
        setIsDownloadShow(false);
        setMsgContent("文件上传失败");
        setIsMsgShow(true);
        setTimeout(() => { setIsMsgShow(false); }, 3000);
    }
})
    .catch((e) => {
    setIsDownloadShow(false);
    console.log(e);
    setMsgContent(e.message);
    setIsMsgShow(true);
    setTimeout(() => { setIsMsgShow(false); }, 3000);
});
```

```html
<FormControl>
    <FormLabel id="demo-row-radio-buttons-group-label">下载方式</FormLabel>
    <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={downloadType}
                onChange={(e) => setDownloadType(e.target.value)}
        >
        <FormControlLabel value="0" control={<Radio />} label="域内下载" />
        <FormControlLabel value="1" control={<Radio />} label="跨域下载" />
    </RadioGroup>
</FormControl>
```

