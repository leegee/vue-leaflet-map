import AppMap from '@/components/AppMap';
const AppHelp = () => import('@/components/AppHelp');


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
    }
];

export default routes;