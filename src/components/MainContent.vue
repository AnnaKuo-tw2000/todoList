<script setup>
import { ElMessage } from "element-plus";
import { useCounterStore } from '../stores/counter';

const store = useCounterStore();
const { proxy } = getCurrentInstance();
// 刪除
function deleteNote(noteId) {
    const index = store.noteList.findIndex((note) => note.id === noteId);
    if (index !== -1) {
        store.noteList.splice(index, 1);
    }
    store.saveToLocalStorage();
}
// 完成
function confirmFinish(val, noteId) {
    const index = store.noteList.findIndex((note) => note.id === noteId);
    if (index !== -1) {
        store.noteList[index].isComplete = val;
    }
    store.saveToLocalStorage();
    console.log(store.noteList);
}
// 我的最愛
function addFavorite(id) {
    const index = store.noteList.findIndex((note) => note.id === id);
    if (index) {
        const removedItem = store.noteList.splice(index, 1)[0];
        store.noteList.unshift(removedItem);
    }
    store.saveToLocalStorage();
}

// 編輯
const selectId = ref('');
const open_itemDialog = ref(false);
function editNote(id) {
    selectId.value = id;
    open_itemDialog.value = true;
    // console.log(open_itemDialog.value);
}
function closeItemDialog() {
    open_itemDialog.value = false;
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
    // 過濾陣列，找出有提醒時間，而且尚未提醒，而且尚未完成的項目
    const targetArr = store.noteList.filter((note) => note.reminderTimestamp && !note.shouldRemind && !note.isComplete);
    if (targetArr.length > 0) {
        targetArr.forEach((note) => {
            // 计算当前时间和完成日的天数差
            const dayDiff = proxy.$dayjs(note.completionDate).diff(now, 'day');
            let dayDiffMsg = '';
            if (dayDiff > 0) {
                dayDiffMsg = store.isTwLocale === true ? `還有${dayDiff}天就是${note.title}的完成日` : `There are still ${dayDiff} before the completion date of ${note.title}.`;
            } else if (dayDiff < 0) {
                dayDiffMsg = store.isTwLocale === true ? `已經超過${note.title}的完成日` : `The completion date of ${note.title} has passed.`;
            } else {
                dayDiffMsg = store.isTwLocale === true ? `今天就是${note.title}的完成日` : `Today is the completion date of ${note.title}.`;
            }

            const timerId = setTimeout(() => {
                ElMessage({
                    showClose: true,
                    message: store.isTwLocale === true ? `${dayDiffMsg}` : `${dayDiffMsg}`,
                    duration: 0
                });
                note.shouldRemind = true;
                store.saveToLocalStorage();
                // 清除计时器
                clearTimeout(timerId);
            }, note.reminderTimestamp - now);

            setTimeoutArr.push(timerId);
        });
    }
});

</script>
<template>
    <main class="todoList__main px-4 py-5 dark:bg-dkSecondary overflow-auto">
        <div v-for="note in store.filterNoteList" :key="note.id">
            <div class="flex justify-between items-center mb-0.5">
                <el-checkbox v-model="note.isComplete" :label="note.title" @change="confirmFinish($event, note.id)" />
                <div class="text-txSecondary flex items-center">
                    <font-awesome-icon :icon="['fas', 'pen-to-square']" class="mx-2 hover:cursor-pointer"
                        @click="editNote(note.id)" />
                    <font-awesome-icon :icon="['fas', 'trash-can']" class="mx-2 hover:cursor-pointer"
                        @click="deleteNote(note.id)" />
                    <el-rate v-model="note.isFavorite" :max="1" class="mx-2" clearable @click="addFavorite(note.id)" />
                </div>
            </div>
            <div class="ml-6 text-txSecondary text-xs flex mb-2">
                <i-ep-AlarmClock v-if="note.completionDate" :class="{ active: note.shouldRemind }" />
                <div v-if="note.completionDate" :class="{ active: note.shouldRemind }">{{
                    formatCompletionDate(note.completionDate) }}</div>
            </div>
        </div>
        <el-empty :description="store.isTwLocale === true ? '來添加提醒項目吧！' : 'Lets add a reminder item!'"
            v-if="!store.noteList[0]" />
    </main>
    <ItemDialog v-if="open_itemDialog" :open_itemDialog="open_itemDialog" @close_itemDialog="closeItemDialog"
        :selectId="selectId" />
</template>
<style lang="scss" scoped>
.active {
    color: red;
}
</style>
