import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  MenuItem,
  FormControl,
  Select
} from '@mui/material';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// ============================|| FIREBASE - LOGIN ||============================ //
import { useNavigate } from 'react-router-dom';
import { userLoginService } from 'api';

const AuthLogin = () => {
  const [checked, setChecked] = React.useState(false);
  const [domain, setDomain] = React.useState('Adomain');
  const [attributeList, setAttributeList] = React.useState('(2,4,5,6)');
  const handleDomainChange = (event: SelectChangeEvent) => {
    setDomain(event.target.value);
  };
  const handleChangeAttributeList = (event: SelectChangeEvent) => {
    setAttributeList(event.target.value);
  };
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const nav = useNavigate();
  return (
    <>
      <Formik
        initialValues={{
          username: 'Alice',
          domain: 'Adomain',
          attributeset: '(2,4,5,6)'
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().required('请填写用户名')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const { username, domain, attributeset } = values;
          localStorage.setItem('username', username);
          localStorage.setItem('domain', domain);
          let data = {
            "username" : username,
            "domain" : domain,
            "attributeset" : attributeset
          }
          console.log(data)
          userLoginService(data)
            .then((res) => {
              console.log(res);
              setStatus({ success: true });
              setSubmitting(false);
              nav('/');
            })
            .catch((err) => {
              console.log(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            });
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="username-login">用户名</InputLabel>
                  <OutlinedInput
                    id="username-login"
                    type="text"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="请输入用户名"
                    fullWidth
                    error={Boolean(touched.username && errors.username)}
                  />
                  {touched.username && errors.username && (
                    <FormHelperText error id="standard-weight-helper-text-username-login">
                      {errors.username}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {/* <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">密码</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid> */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  {/* <InputLabel htmlFor="password-login">所属域</InputLabel> */}
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-standard-label">所属域</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={domain}
                      onChange={handleDomainChange}
                      label="domain"
                    >
                      <MenuItem value={'Adomain'}>Adomain</MenuItem>
                      <MenuItem value={'Bdomain'}>Bdomain</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-standard-label">属性集</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={attributeList}
                      onChange={handleChangeAttributeList}
                      label="domain"
                    >
                      <MenuItem value={'(2,4,5,6)'}>(2,4,5,6)</MenuItem>
                      <MenuItem value={'(1,2,3)'}>(1,2,3)</MenuItem>
                      <MenuItem value={'(1,2,3,4)'}>(1,2,3,4)</MenuItem>
                      <MenuItem value={'(1,2,3,4,5)'}>(1,2,3,4,5)</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              {/* <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Keep me sign in</Typography>}
                  />
                  <Link variant="h6" component={RouterLink} to="" color="text.primary">
                    Forgot Password?
                  </Link>
                </Stack>
              </Grid> */}
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    登录
                  </Button>
                </AnimateButton>
              </Grid>
              {/* <Grid item xs={12}>
                <Divider>
                  <Typography variant="caption"> Login with</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <FirebaseSocial />
              </Grid> */}
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
