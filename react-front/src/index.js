import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './compiled/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import LngDetector from 'i18next-browser-languagedetector';

import Global from './Global';
import i18next from 'i18next';

import transJA from "./locales/ja/translations.json";
import transEN from "./locales/en/translations.json";

Global.resetBackgroundImage();
Global.resetTitle();

i18next.use(LngDetector)
.init({
  interpolation: { escapeValue: false },  // React already does escaping
  lng: 'ja',                              // language to use
  resources: {
    en: {
      translations: transEN
    },
    ja: {
      translations: transJA
    },
  },
});



ReactDOM.render(<BrowserRouter><I18nextProvider i18n={ i18next }><App/></I18nextProvider></BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
