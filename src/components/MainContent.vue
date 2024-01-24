<script setup>
import { ElMessage } from "element-plus";
import { useDark } from '@vueuse/core';
import { useNoteStateStore } from '../stores/noteState';
import { useLanguageStore } from '../stores/language';

const noteStateStore = useNoteStateStore();
const languageStore = useLanguageStore();
const isDark = useDark();
const { proxy } = getCurrentInstance();
// 刪除
function deleteNote(noteId) {
    const index = noteStateStore.noteList.findIndex((note) => note.id === noteId);
    if (index !== -1) {
        noteStateStore.noteList.splice(index, 1);
    }
    noteStateStore.saveToLocalStorage();
}
// 完成
function confirmFinish(val, noteId) {
    const index = noteStateStore.noteList.findIndex((note) => note.id === noteId);
    if (index !== -1) {
        noteStateStore.noteList[index].isComplete = val;
        noteStateStore.noteList[index].shouldRemind = false;
    }
    noteStateStore.saveToLocalStorage();
}
// 我的最愛
function addFavorite(id) {
    const index = noteStateStore.noteList.findIndex((note) => note.id === id);
    if (index) {
        const removedItem = noteStateStore.noteList.splice(index, 1)[0];
        noteStateStore.noteList.unshift(removedItem);
    }
    noteStateStore.saveToLocalStorage();
}

// 編輯
const selectId = ref('');
const open_itemDialog = ref(false);
function editNote(id) {
    selectId.value = id;
    open_itemDialog.value = true;
    // console.log(open_itemDialog.value);
}

// 格式化預計完成日
function formatCompletionDate(date) {
    return proxy.$dayjs(date).format('YYYY-MM-DD');
}

// 鬧鐘
let setTimeoutArr = [];
watchEffect(() => {
    // 為了避免重複設置setTimeout，每次都要全部清理之前設置的
    setTimeoutArr.forEach((item) => {
        clearTimeout(item);
    });
    setTimeoutArr = [];

    const now = new Date();
    // 過濾陣列，找出有提醒時間，尚未提醒，且尚未完成的項目
    const targetArr = noteStateStore.noteList.filter((note) => note.reminderTimestamp && !note.shouldRemind && !note.isComplete);
    if (targetArr.length > 0) {
        targetArr.forEach((note) => {
            // 计算当前时间和完成日的天数差
            const dayDiff = proxy.$dayjs(note.completionDate).diff(now, 'day');
            let dayDiffMsg = '';
            if (dayDiff > 0) {
                dayDiffMsg = languageStore.isTwLocale === true ? `還有${dayDiff}天就是${note.title}的完成日` : `There are still ${dayDiff} before the completion date of ${note.title}.`;
            } else if (dayDiff < 0) {
                dayDiffMsg = languageStore.isTwLocale === true ? `已經超過${note.title}的完成日` : `The completion date of ${note.title} has passed.`;
            } else {
                dayDiffMsg = languageStore.isTwLocale === true ? `今天就是${note.title}的完成日` : `Today is the completion date of ${note.title}.`;
            }

            const timerId = setTimeout(() => {
                ElMessage({
                    showClose: true,
                    message: languageStore.isTwLocale === true ? `${dayDiffMsg}` : `${dayDiffMsg}`,
                    duration: 0
                });
                note.shouldRemind = true;
                noteStateStore.saveToLocalStorage();
                // 清除计时器
                clearTimeout(timerId);
            }, note.reminderTimestamp - now);

            setTimeoutArr.push(timerId);
        });
    }
});

</script>
<template>
    <main class="todoList__main px-4 py-7 bg-secondary dark:bg-dkSecondary overflow-auto"
        :class="{ 'pt-20': noteStateStore.show_searchInput, dark: isDark, empty: !noteStateStore.noteList[0] }">
        <div v-for="note in noteStateStore.filterNoteList" :key="note.id" class="h-[54px] relative z-10">
            <div class="flex justify-between items-center mb-0.5">
                <el-checkbox v-model="note.isComplete" :label="note.title" @change="confirmFinish($event, note.id)"
                    :style="{ 'text-decoration-line': note.isComplete ? 'line-through' : 'none' }" />
                <div class="text-txSecondary flex items-center">
                    <font-awesome-icon :icon="['fas', 'pen-to-square']"
                        class="mx-2 hover:cursor-pointer  hover:text-lime-800" @click="editNote(note.id)" />
                    <font-awesome-icon :icon="['fas', 'trash-can']" class="mx-2 hover:cursor-pointer hover:text-orange-700"
                        @click="deleteNote(note.id)" />
                    <el-rate v-model="note.isFavorite" :max="1" class="mx-2" clearable @click="addFavorite(note.id)" />
                </div>
            </div>
            <div class="ml-6 text-txSecondary flex gap-3 text-sm mb-2">
                <div class="flex mb-.5 shrink-0 items-center">
                    <i-ep-AlarmClock v-if="note.reminderTimestamp" :class="{ active: note.shouldRemind }" />
                    <!-- <i-ep-Calendar v-if="note.completionDate && !note.reminderTimestamp"
                        :class="{ active: new Date(note.completionDate).getTime() < new Date().getTime() && !note.isComplete }" /> -->
                    <font-awesome-icon :icon="['far', 'calendar-check']"
                        v-if="note.completionDate && !note.reminderTimestamp" class="relative -top-px"
                        :class="{ active: new Date(note.completionDate).getTime() < new Date().getTime() && !note.isComplete }" />
                    <div v-if="note.completionDate"
                        :class="{ active: new Date(note.completionDate).getTime() < new Date().getTime() && !note.isComplete }">
                        {{
                            formatCompletionDate(note.completionDate) }}</div>
                </div>
                <div class="flex" v-if="note.content">
                    <i-ep-Memo />
                    <el-text class="w-150px" line-clamp="1">{{ note.content }}</el-text>
                </div>

            </div>
        </div>
        <el-empty :description="languageStore.isTwLocale === true ? '來添加提醒項目吧！' : 'Lets add a reminder item!'"
            v-if="!noteStateStore.noteList[0]" />
        <el-empty :description="languageStore.isTwLocale === true ? '這裡沒有事項喔！' : 'There is nothing here!'"
            v-if="noteStateStore.showEmpty" />
    </main>
    <dialogItemDetail v-if="open_itemDialog" :open_itemDialog="open_itemDialog" @close_itemDialog="open_itemDialog = false"
        :selectId="selectId" />
</template>
<style lang="scss" scoped>
.active {
    color: red;
}

.todoList__main {
    transition: padding-top 150ms;

    &.empty {
        &::before {
            opacity: 0.06;
        }

        &.dark {
            &::before {
                opacity: 0.02;
            }
        }
    }

    &::before {
        content: "";
        background-image: url('@/assets/images/alpacaLight.png');
        background-size: 300px 300px;
        background-position: 50% 60%;
        background-repeat: no-repeat;
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        opacity: 0.3;
    }

    &.dark {
        &::before {
            background-image: url('@/assets/images/alpacaDark.png');
            background-position: 50% 63%;
            opacity: 0.15;
        }
    }
}

:deep() {
    .el-checkbox__label {
        @apply text-base;
    }

    .el-text {
        @apply text-txSecondary;
    }
}
</style>
