import "core-js/stable";
import "regenerator-runtime/runtime";

import './styles/index.scss'
import "leaflet/dist/leaflet.css";

import Vue from 'vue';

import App from './App';
import router from './Router';
import { store, setApi } from './Store';

import('./apis/' + process.env.API + '/style.scss');

import('./apis/' + process.env.API + '/index').then(api => {

    setApi(api);

    new Vue({
        el: '#app',
        render: h => h(App),
        router,
        store,
    });
});