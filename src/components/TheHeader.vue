<script setup>
// 現在會自動引入用到的Vue3 API，所以不再需要手動import { ref/computed } 這些東西了
import zhTw from 'element-plus/dist/locale/zh-tw.mjs';
import en from 'element-plus/dist/locale/en.mjs';
import { Sunny, Moon } from '@element-plus/icons-vue';
import { useDark, useToggle } from '@vueuse/core';
import { useCounterStore } from '../stores/counter';

const store = useCounterStore();
const { proxy } = getCurrentInstance();

// 黑夜模式
const isDark = useDark();
const toggleDark = useToggle(isDark);

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

// 彈窗相關資料
const open_itemDialog = ref(false);
function closeItemDialog() {
    open_itemDialog.value = false;
}

// todoList相關-增加新事項
const addTaskInput = ref('');
function addNewNotes() {
    const id = Date.now();
    store.noteList.push({
        id,
        title: addTaskInput.value,
        content: '',
        completionDate: '',
        reminderTime: '',
        isComplete: false,
        isFavorite: 0,
    });
    addTaskInput.value = '';
}

// 隱藏紅點
const showDot = computed(() => {
    const hasReminder = store.noteList.findIndex((note) => note.reminderTime !== '');
    if (hasReminder !== -1) {
        return false;
    }
    return true;
});

</script>
<template>
    <header class="todoList__header bg-primary dark:bg-dkPrimary p-4" ref="headerRef">
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
                <el-dropdown trigger="click" :hide-on-click="false">
                    <!-- 使用 :hidden="布林值變數" 來切換是否隱藏紅點 -->
                    <el-badge is-dot class="leading-none" :hidden="showDot">
                        <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" size="xl" class="mx-1" />
                    </el-badge>
                    <template #dropdown>
                        <el-dropdown-menu class="todoList__ellipsisDropdownMenu">
                            <el-dropdown-item>
                                <el-badge is-dot class="leading-none" :hidden="showDot"><font-awesome-icon
                                        :icon="['fas', 'bell']" /></el-badge>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <font-awesome-icon :icon="['fas', 'language']" size="lg" @click="toggleLocale" />
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-switch :model-value="isDark" size="small" :active-action-icon="Sunny"
                                    :inactive-action-icon="Moon" :active-value="false" :inactive-value="true"
                                    @change="toggleDark()" />
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </section>
        <el-input v-model="addTaskInput" placeholder="+ 新增項目" class="el-input__rounded-full" @keydown.enter="addNewNotes">
            <template #suffix>
                <div class="h-[28px] w-[28px] bg-primary dark:bg-dkTertiary rounded-full cursor-pointer"
                    @click="open_itemDialog = true">
                    <font-awesome-icon :icon="['fas', 'plus']" class="text-white text-xl" />
                </div>
            </template>
        </el-input>
    </header>
    <ItemDialog :open_itemDialog="open_itemDialog" @close_itemDialog="closeItemDialog" />
</template>
<style lang="scss" scoped>
:deep() {
    .el-input__wrapper {
        @apply pl-4;
        padding-right: 3px;
    }
}
</style>