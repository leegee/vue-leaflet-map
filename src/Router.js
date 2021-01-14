import Vue from 'vue';
import VueRouter from 'vue-router';
import AppMap from '@/components/AppMap';

Vue.use(VueRouter);

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
    },
];

export default new VueRouter({
    routes,
    linkActiveClass: 'active',
    mode: 'history'
});

