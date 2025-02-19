import { createApp } from 'vue'
import router from "./router";

import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import * as components from 'vuetify/components'
import * as directives from "vuetify/directives";
import theme from '@/plugins/theme';
import defaultVuetify from '@/plugins/defaultVuetify';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import '@mdi/font/css/materialdesignicons.css'
import "vuetify/styles";
import './style.css';

import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  theme,
  defaults: defaultVuetify
})

const defaultToastOptions = {
  transition: "Vue-Toastification__bounce",
  maxToasts: 10,
  newestOnTop: true,
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  closeButton: "button",
  icon: true,
  rtl: false
}

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(vuetify)
  .use(pinia)
  .use(Toast, defaultToastOptions)
  .mount('#app')
