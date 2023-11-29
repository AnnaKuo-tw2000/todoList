<script setup>
// 現在會自動引入用到的Vue3 API，所以不再需要手動import { ref/computed } 這些東西了
import zhTw from 'element-plus/dist/locale/zh-tw.mjs';
import en from 'element-plus/dist/locale/en.mjs';

const { proxy } = getCurrentInstance();

// i18n支援
const isTwLocale = ref(navigator.language === 'zh-TW');
const dayjsLocale = ref(isTwLocale.value ? 'zh-tw' : 'en');
const elementPlusLocale = ref(isTwLocale.value ? zhTw : en);
function toggleLocale() {
    isTwLocale.value = !isTwLocale.value;
    dayjsLocale.value = isTwLocale.value ? 'zh-tw' : 'en';
    elementPlusLocale.value = isTwLocale.value ? zhTw : en;
    initDayjs();
}

// dayjs時間呈現
const curDate = ref('');
const curYear = ref('');
const curMonth = ref('');
const curDay = ref('');
const curTime = ref('');
initDayjs();

function initDayjs() {
    curDate.value = proxy.$dayjs().locale(dayjsLocale.value).format('DD');
    curYear.value = proxy.$dayjs().locale(dayjsLocale.value).format('YYYY');
    curMonth.value = proxy.$dayjs().locale(dayjsLocale.value).format('MMM');
    curDay.value = proxy.$dayjs().locale(dayjsLocale.value).format('ddd');
    setInterval(() => {
        curTime.value = proxy.$dayjs().locale(dayjsLocale.value).format('hh:mm:ss A');
    }, 1000);
}

// todoList相關資料
const addTaskInput = ref('');
const checkA = ref(false);

// 彈窗相關資料
const open_itemDialog = ref(false);
const title = ref('');
const content = ref('');
const completionDate = ref('');
const reminderTime = ref('');

// main區塊高度計算
const headerRef = ref(null);
const footerRef = ref(null);
const todoListMainStyle = computed(() => {
    const headerHeight = headerRef.value?.offsetHeight || 0;
    const footerHeight = footerRef.value?.offsetHeight || 0;
    return { height: `calc(var(--vh, 1vh) * 100 - ${headerHeight}px - ${footerHeight}px)` };
});
</script>

<template>
    <div>
        <header class="todoList__header bg-primary p-4" ref="headerRef">
            <section class="flex justify-between items-center mb-5">
                <div class="flex items-center mr-1">
                    <div class="text-4xl mr-1">{{ curDate }}</div>
                    <div>
                        <div class="leading-none">{{ curYear }}</div>
                        <div class="leading-none">{{ curMonth }}</div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div class="flex flex-col items-end mr-2">
                        <div class="leading-none">{{ curDay }}</div>
                        <div class="">{{ curTime }}</div>
                    </div>
                    <el-badge is-dot class="leading-none">
                        <font-awesome-icon :icon="['fas', 'bell']" size="lg" />
                    </el-badge>
                </div>
            </section>
            <font-awesome-icon :icon="['fas', 'language']" size="lg" @click="toggleLocale" />
            <el-input v-model="addTaskInput" placeholder="+ 新增項目" class="el-input__rounded-full">
                <template #suffix>
                    <div class="el-input__suffixIcon--plus bg-primary rounded-full cursor-pointer"
                        @click="open_itemDialog = true">
                        <font-awesome-icon :icon="['fas', 'plus']" class="text-white text-xl" />
                    </div>
                </template>
            </el-input>
        </header>
        <main class="todoList__main px-4 py-5" :style="todoListMainStyle">
            <section>
                <div class="flex justify-between items-center">
                    <el-checkbox v-model="checkA" label="HelloA" />
                    <div class="text-tertiary">
                        <font-awesome-icon :icon="['fas', 'pen-to-square']" class="mx-2" />
                        <font-awesome-icon :icon="['fas', 'trash-can']" class="mx-2" />
                        <font-awesome-icon :icon="['far', 'star']" class="mx-2" />
                    </div>
                </div>
                <div class="ml-6 text-tertiary text-xs flex">
                    <el-icon><i-ep-AlarmClock /></el-icon>
                </div>
            </section>
        </main>
        <footer class="todoList__footer flex justify-evenly py-4" ref="footerRef">
            <el-button plain round class="todoList__filterBtn">All</el-button>
            <el-button plain round class="todoList__filterBtn">Completed</el-button>
            <el-button plain round class="todoList__filterBtn">Incomplete</el-button>
        </footer>

        <el-dialog v-model="open_itemDialog" title="新增細項" width="65%" draggable>
            <main>
                <div class="flex items-center">
                    <el-icon><i-ep-CollectionTag /></el-icon>
                    <el-input v-model="title" placeholder="標題" clearable />
                </div>
                <div class="flex items-center">
                    <el-icon><i-ep-Document /></el-icon>
                    <el-input v-model="content" placeholder="詳情" clearable />
                </div>
                <div class="flex items-center">
                    <font-awesome-icon :icon="['far', 'calendar-check']" />
                    <el-config-provider :locale="elementPlusLocale">
                        <el-date-picker v-model="completionDate" type="date" placeholder="預計完成日" />
                    </el-config-provider>
                </div>
                <div class="flex items-center">
                    <font-awesome-icon :icon="['far', 'clock']" />
                    <el-config-provider :locale="elementPlusLocale">
                        <el-time-picker v-model="reminderTime" placeholder="提醒時間" />
                    </el-config-provider>
                </div>
            </main>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">
                        確認
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
.el-input__suffixIcon--plus {
    height: 28px;
    width: 28px;
}

.todoList__main {
    overflow: auto;
}

:deep() {
    .el-input__wrapper {
        @apply pl-4;
        padding-right: 3px;
    }

    .todoList__filterBtn {

        &.el-button:hover,
        &.el-button:focus,
        &.el-button:active {
            @apply bg-primary border-primary text-white;

        }
    }
}
</style>
