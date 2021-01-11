import './styles/index.scss'
import "leaflet/dist/leaflet.css";

import Vue from 'vue';

import App from './App';
import router from './Router';
import store from './Store';

new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store,
});