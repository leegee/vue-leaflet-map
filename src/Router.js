import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const AppHelp = () => import('@/components/AppHelp');
const AppSearch = () => import('@/components/AppSearch');

const routes = [
    {
        path: '/help',
        name: 'Help',
        component: AppHelp
    },
    {
        path: '/search',
        name: 'Search',
        component: AppSearch
    },
];

export default new VueRouter({
    routes,
    linkActiveClass: 'active',
    mode: 'history'
});

