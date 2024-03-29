/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */

import "@/assets/main.scss";
import "element-plus/theme-chalk/src/message.scss";
// VueJS
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";
import router from "@/router";
// dayjs
import { dayjs } from "element-plus";
import "dayjs/locale/zh-tw";

// Fontawesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// 這邊只去引入需要的 icon
import {
    faPlus,
    faPenToSquare,
    faTrashCan,
    faBell as fasBell,
    faArrowLeft,
    faLanguage,
    faEllipsisVertical,
    faHeart,
    faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import {
    faStar,
    faBell as farBell,
    faCalendarCheck,
    faClock,
    faMoon,
} from "@fortawesome/free-regular-svg-icons";
import { useNoteStateStore } from "./stores/noteState";

library.add(
    faPlus,
    faPenToSquare,
    faTrashCan,
    faStar,
    fasBell,
    farBell,
    faArrowLeft,
    faCalendarCheck,
    faClock,
    faLanguage,
    faMoon,
    faEllipsisVertical,
    faHeart,
    faMagnifyingGlass
);

const app = createApp(App);

app.use(createPinia());
app.use(router);

// 創建或獲取 useNoteStateStore 實例
const store = useNoteStateStore();
// 檢查本地存儲中是否存在已保存的 noteList
const savedNoteList = localStorage.getItem("noteList");
// 如果存在，將其解析成物件並設置為 useNoteStateStore 中的 noteList
if (savedNoteList) {
    store.noteList = JSON.parse(savedNoteList);
}

// 將fontAwesome的插件元件 FontAwesomeIcon 設置為全域元件
app.component("font-awesome-icon", FontAwesomeIcon);

// 將dayjs設為全域元件屬性，也就是可以在每個元件中拿到這個物件
// optionsAPI：this.$dayjs
// compositionAPI： const { proxy } = getCurrentInstance();  用 proxy.$dayjs 取得
app.config.globalProperties.$dayjs = dayjs;

app.mount("#app");
