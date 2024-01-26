<script setup>
// 現在會自動引入用到的Vue3 API，所以不再需要手動import { ref/computed } 這些東西了
import zhTw from 'element-plus/dist/locale/zh-tw.mjs';
import en from 'element-plus/dist/locale/en.mjs';
import { Sunny, Moon } from '@element-plus/icons-vue';
import { useDark, useToggle } from '@vueuse/core';
import { ElMessage } from "element-plus";
import { useNoteStateStore } from '../stores/noteState';
import { useLanguageStore } from '../stores/language';

const noteStateStore = useNoteStateStore();
const languageStore = useLanguageStore();
const { proxy } = getCurrentInstance();

// 黑夜模式
const isDark = useDark();
const toggleDark = useToggle(isDark);

// i18n支援
const dayjsLocale = ref(languageStore.isTwLocale ? 'zh-tw' : 'en');
const elementPlusLocale = ref(languageStore.isTwLocale ? zhTw : en);
function toggleLocale() {
    languageStore.isTwLocale = !languageStore.isTwLocale;
    dayjsLocale.value = languageStore.isTwLocale ? 'zh-tw' : 'en';
    elementPlusLocale.value = languageStore.isTwLocale ? zhTw : en;
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

// todoList相關-增加新事項
const addTaskInput = ref('');

function addNewNotes() {
    if (!addTaskInput.value) {
        if (languageStore.isTwLocale === true) {
            ElMessage({
                message: '請輸入標題',
                type: 'warning',
            });
        } else {
            ElMessage({
                message: 'Please enter a title.',
                type: 'warning',
            });
        }
    } else {
        const id = Date.now();
        noteStateStore.noteList.push({
            id,
            title: addTaskInput.value,
            content: '',
            completionDate: '',
            reminderDuration: '',
            reminderTime: '',
            isComplete: false,
            isFavorite: 0,
            shouldRemind: false

        });
        noteStateStore.saveToLocalStorage();
    }
    addTaskInput.value = '';
}

// 隱藏紅點
const showDot = computed(() => {
    const hasReminder = noteStateStore.noteList.findIndex((note) => note.reminderTimestamp);
    if (hasReminder !== -1) {
        // 有需要提醒的就不需要隱藏紅點
        return false;
    }
    return true;
});

// 小鈴鐺打開需提醒事項彈窗
const open_tableDialog = ref(false);
</script>
<template>
    <div>
        <header class="todoList__header relative z-20">
            <section class="bg-primary dark:bg-dkPrimary p-4 relative z-20">
                <div class="flex justify-between items-center mb-5">
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
                                    <el-dropdown-item @click="open_tableDialog = true">
                                        <el-badge is-dot class="leading-none" :hidden="showDot"><font-awesome-icon
                                                :icon="['fas', 'bell']" /></el-badge>
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="toggleLocale">
                                        <font-awesome-icon :icon="['fas', 'language']" size="lg" />
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
                </div>
                <el-input v-model="addTaskInput" :placeholder="languageStore.isTwLocale === true ? '+ 新增項目' : '+ Add Task'"
                    class="todoList__addInput el-input__rounded-full" @keydown.enter="addNewNotes">
                    <template #suffix>
                        <el-button type="primary" round class="relative" @click="open_itemDialog = true">
                            <div
                                class="hover:animate-ping absolute left-0 h-full w-full bg-dkTertiary rounded-full opacity-0 hover:opacity-30" />
                            <font-awesome-icon :icon="['fas', 'plus']" class="text-white text-xl" />
                        </el-button>
                    </template>
                </el-input>
            </section>
            <div class="absolute top-full left-0 w-full border-b border-txTertiary dark:border-dkTxSecondary px-8 pb-4 bg-primary dark:bg-dkPrimary flex items-center transition-all leading-none shadow-md shadow-gray-300 dark:shadow-gray-500"
                :class="{ '-translate-y-[98%]': !noteStateStore.show_searchInput, 'rounded-b-xl': noteStateStore.show_searchInput }">
                <div class="text-sm shrink-0">關鍵字：</div>
                <el-input v-model="noteStateStore.searchTxt" placeholder="請輸入" class="todoList__searchInput"
                    :class="{ dark: isDark }" clearable />
                <div class="absolute -bottom-5 right-[18px] border border-t-0 bg-primary dark:bg-dkPrimary border-txTertiary dark:border-dkTxSecondary rounded-b-xl h-5 w-7 cursor-pointer text-center shadow-md shadow-gray-300 dark:shadow-gray-500"
                    @click="noteStateStore.show_searchInput = !noteStateStore.show_searchInput">
                    <el-badge :is-dot="!!noteStateStore.searchTxt">
                        <font-awesome-icon :icon="['fas', 'magnifying-glass']" size="xs" />
                    </el-badge>
                </div>
            </div>
        </header>
        <dialogItemDetail :open_itemDialog="open_itemDialog" @close_itemDialog="open_itemDialog = false"
            :elementPlusLocale="elementPlusLocale" />
        <dialogAlarmTable :open_tableDialog="open_tableDialog" @close_tableDialog="open_tableDialog = false" />
    </div>
</template>
<style lang="scss" scoped>
:deep() {
    .todoList__header {

        .todoList__addInput {

            div.el-input__wrapper {
                @apply pl-4;
                padding-right: 3px;

                span.el-input__suffix {
                    button.el-button {
                        @apply h-[28px] w-[28px] p-0;
                    }
                }
            }
        }

        .todoList__searchInput {

            div.el-input__wrapper {
                @apply border-b border-txPrimary shadow-none rounded-none py-0 bg-transparent;

                input.el-input__inner {
                    @apply text-txPrimary;

                    &::placeholder {
                        @apply text-dkTxTertiary;
                    }
                }

                span.el-input__suffix {
                    i.el-icon.el-input__clear {
                        @apply text-txPrimary;
                    }
                }
            }

            &.dark {
                div.el-input__wrapper {
                    @apply border-dkTxTertiary;

                    &:hover {
                        @apply border-dkTxSecondary;
                    }

                    &.is-focus {
                        @apply border-dkTertiary;
                    }

                    input.el-input__inner {
                        @apply text-dkTxPrimary;
                    }

                    span.el-input__suffix {
                        i.el-icon.el-input__clear {
                            @apply text-dkTxPrimary;
                        }
                    }
                }
            }
        }
    }
}
</style>
