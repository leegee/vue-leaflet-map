import "core-js/stable";
import "regenerator-runtime/runtime";

import './styles/index.scss'
import "leaflet/dist/leaflet.css";

import Vue from 'vue';

import App from './App';
import router from './Router';
import { store, setApi } from './Store';

import * as api from './implementations/OpenSky/Api';

setApi(api);

new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store,
});