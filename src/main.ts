import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import router from './router'
import '@/assets/foyer.css'; 
import "bootstrap/dist/js/bootstrap.bundle.min.js";

createApp(App).use(router).mount('#app')
