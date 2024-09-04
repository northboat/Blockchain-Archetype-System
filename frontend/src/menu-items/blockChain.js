// assets
import { ProfileOutlined, ChromeOutlined, DashboardOutlined, QuestionOutlined } from '@ant-design/icons';
const icons = {
  DashboardOutlined,
  ChromeOutlined,
  QuestionOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const blockChain = {
  id: 'Dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'accessControl',
      title: '访问控制服务',
      type: 'item',
      url: '/access',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'authentication',
      title: '认证与密钥协商',
      type: 'item',
      url: '/auth',
      icon: icons.ChromeOutlined,
      breadcrumbs: false
    },
    {
      id: 'detect',
      title: '异常流量检测与溯源',
      type: 'item',
      url: '/detect',
      icon: icons.QuestionOutlined,
      breadcrumbs: false
    }
    // {
    //   id: 'trace',
    //   title: '溯源服务',
    //   type: 'item',
    //   url: '/trace',
    //   icon: icons.ProfileOutlined,
    //   breadcrumbs: false
    // }
  ]
};

export default blockChain;
