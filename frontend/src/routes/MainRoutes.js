import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

// block-chain
const Welcome = Loadable(lazy(() => import('pages/welcome')));
const AccessControl = Loadable(lazy(() => import('pages/access-control')));
const KeyAgreement = Loadable(lazy(() => import('pages/key-agreement')));
const AbnormalTraffic = Loadable(lazy(() => import('pages/abnormal-traffic')));
const Trace = Loadable(lazy(() => import('pages/trace')));
const Detact = Loadable(lazy(() => import('pages/detect')));
const History = Loadable(lazy(() => import('pages/detect/history')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Welcome />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'access',
      element: <AccessControl />
    },
    {
      path: 'auth',
      element: <KeyAgreement />
    },
    {
      path: 'detect',
      element: <Detact />
    },
    {
      path: 'history',
      element: <History />
    }
  ]
};

export default MainRoutes;
