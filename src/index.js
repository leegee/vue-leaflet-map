import "core-js/stable";
import "regenerator-runtime/runtime";

import './styles/index.scss'
import "leaflet/dist/leaflet.css";

import Vue from 'vue';

import App from './App';
import router from './Router';
import { store, setApi } from './Store';

import('./apis/' + process.env.implementation + '/marker.scss').then(_ => {
    import('./apis/' + process.env.implementation + '/Api').then(api => {
        App.setIplementation(process.env.implementation);

        setApi(api);

        new Vue({
            el: '#app',
            render: h => h(App),
            router,
            store,
        });
    });
});