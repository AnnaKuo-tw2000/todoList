/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */

import "@/assets/main.scss";

// VueJS
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";
import router from "@/router";

// Fontawesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// 這邊只去引入需要的 icon
import {
    faPlus,
    faPenToSquare,
    faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { faStar, faBell } from "@fortawesome/free-regular-svg-icons";

library.add(faPlus, faPenToSquare, faTrashCan, faStar, faBell);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
