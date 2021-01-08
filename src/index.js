import './styles/index.scss'
import "leaflet/dist/leaflet.css";

import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App';
import routes from './routes';
import Vuex from 'vuex';

Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
    routes,
    linkActiveClass: 'active',
    mode: 'history'
});

const store = new Vuex.Store({
    state: {
        count: 0,
        drawer: {
            open: false
        }
    },
    actions: {
    },
    mutations: {
        drawerOpen: state => state.drawer.open = true,
        drawerClose: state => state.drawer.open = false,
    }
});

new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store,
});