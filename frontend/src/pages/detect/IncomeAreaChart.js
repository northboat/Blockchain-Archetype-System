import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { PieChart } from '@mui/x-charts/PieChart';
import { detectResultService, detectResultListService, detectAllService } from 'api/detect';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

const PIE_CHART_DATA = [
  { id: 0, value: 105, label: '正常' },
  { id: 1, value: 21, label: '异常行为' },
  { id: 2, value: 9, label: '设备故障' }
];

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({ slot }) => {
  const theme = useTheme();
  const ERROR_NUM = [47, 53, 58, 56, 79, 87, 85, 79, 76, 83, 77, 79, 76, 73, 76, 75, 71, 70, 65];
  const CHECK_NUM = [347, 355, 436, 441, 448, 443, 440, 395, 397, 421, 433, 439, 416, 414, 427, 417, 389, 375, 362];
  const TIME_INTERVAL = [
    '13:00',
    '13:20',
    '13:40',
    '14:00',
    '14:20',
    '14:40',
    '15:00',
    '15:20',
    '15:40',
    '16:00',
    '16:20',
    '16:40',
    '17:00',
    '17:20',
    '17:40',
    '18:00',
    '18:20',
    '18:40',
    '19:00',
    '19:20'
  ];
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories: TIME_INTERVAL,
        // slot === 'month'
        //   ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        //   : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],

        labels: {
          style: {
            colors: [
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary
            ]
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: slot === 'month' ? 11 : 7
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      tooltip: {
        theme: 'light'
      }
    }));
  }, [primary, secondary, line, theme, slot]);

  const [series, setSeries] = useState([]);

  const [pieChartData, setPieChartData] = useState([]);
  useEffect(() => {    
    // detect/result
    detectResultService()
      .then((res) => {
        // console.log(res);
        if(!res.message){
          return;
        }
        // 没办法，后端不当人，他不返回数据我也没办法，只能放点静态数据
        // 不然在前端 session 存没用，那样一个浏览器一个值，更是畜
        if(res.message == "no change"){
          // 返回某次现成值
          let check_num = [192, 192, 192, 192, 192, 192, 192, 192, 192, 192]
          let error_num = [44, 44, 42, 41, 43, 43, 43, 42, 43, 40]
          let pie_chart_data = [
            { id: 0, value: 100, label: '正常' },
            { id: 1, value: 40, label: '异常行为' },
            { id: 2, value: 52, label: '设备故障' }
          ];
          setSeries([
            {
              name: '异常数量',
              data: error_num
            },
            {
              name: '检测数量',
              data: check_num
            }
          ])
          setPieChartData(pie_chart_data);
          return;
        }
        let list = res.message;
        let check_num = [];
        let error_num = [];

        let pie_chart_data = [
          { id: 0, value: null, label: '正常' },
          { id: 1, value: null, label: '异常行为' },
          { id: 2, value: null, label: '设备故障' }
        ];
        for(let i  = 0; i < list.length; i++){
          let info = list[i];
          check_num[i] = info[0];
          error_num[i] = info[1];          
          if(i == list.length-1){
            pie_chart_data[0].value = info[0]-info[1]-info[2];
            pie_chart_data[1].value = info[1];
            pie_chart_data[2].value = info[2];
          }
        }
        console.log(error_num)
        console.log(check_num)
        console.log(pie_chart_data)
        setSeries([
          {
            name: '异常数量',
            data: error_num
          },
          {
            name: '检测数量',
            data: check_num
          }
        ])
        setPieChartData(pie_chart_data);
      })
      .catch((e) => {
        console.log(e);
        alert("请求设备信息和设备异常情况失败");
      });
  }, [slot]);

  return (
    <>
    <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">数据记录</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <ReactApexChart options={options} series={series} type="area" height={450} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">当前设备异常情况</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard
          sx={{ mt: 2 }}
          content={false}
          style={{ height: '473px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <PieChart
            series={[
              {
                data: pieChartData,
                highlightScope: { faded: 'global', highlighted: 'item' }
              }
            ]}
            width={300}
            height={200}
          />
        </MainCard>
      </Grid>
      
    </>
  );
};

IncomeAreaChart.propTypes = {
  slot: PropTypes.string
};

export default IncomeAreaChart;
