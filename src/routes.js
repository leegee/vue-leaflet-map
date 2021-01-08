import AppMap from '@/components/AppMap';
const AppHelp = () => import('@/components/AppHelp');
const ControlDrawer = () => import("@/components/controls/ControlDrawer");

const routes = [
    {
        path: '/',
        name: 'Map',
        component: AppMap
    },
    {
        path: '/help',
        name: 'Help',
        component: AppHelp
    },
    {
        path: '/control-drawer',
        name: 'Drawer',
        component: ControlDrawer
    }
];

export default routes;