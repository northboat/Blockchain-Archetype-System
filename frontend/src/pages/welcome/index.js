import * as React from 'react';
import { styled } from '@mui/material/styles';

const Welcome = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(90vh - 64px)' }}>
      <div>
        <h2>欢迎使用本系统！</h2>
        <h2>点击左侧菜单栏进入对应功能模块</h2>
      </div>
    </div>
  );
};

export default Welcome;
