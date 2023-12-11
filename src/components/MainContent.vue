<script setup>
import { useCounterStore } from '../stores/counter';

const store = useCounterStore();
// main區塊高度計算
const headerRef = ref(null);
const footerRef = ref(null);
const todoListMainStyle = computed(() => {
    const headerHeight = headerRef.value?.offsetHeight || 0;
    const footerHeight = footerRef.value?.offsetHeight || 0;
    return { height: `calc(var(--vh, 1vh) * 100 - ${headerHeight}px - ${footerHeight}px)` };
});

// 刪除
function deleteNote(noteId) {
    const index = store.noteList.findIndex((note) => note.id === noteId);
    if (index !== -1) {
        store.noteList.splice(index, 1);
    }
}
// 完成
function confirmFinish(val, noteId) {
    const index = store.noteList.findIndex((note) => note.id === noteId);
    if (index !== -1) {
        store.noteList[index].isComplete = val;
    }

    console.log(store.noteList);
}
// 我的最愛
function addFavorite(id) {
    const index = store.noteList.findIndex((note) => note.id === id);
    if (index !== -1) {
        const removedItem = store.noteList.splice(index, 1)[0];
        store.noteList.unshift(removedItem);
    }
}

// 編輯

const open_itemDialog = ref(false);
function editNote(id) {
    open_itemDialog.value = true;
    store.paramsId = id;
    console.log(open_itemDialog.value);
}
function closeItemDialog() {
    open_itemDialog.value = false;
}
</script>
<template>
    <main class="todoList__main px-4 py-5 dark:bg-dkSecondary overflow-auto" :style="todoListMainStyle">
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
                <i-ep-AlarmClock />
            </div>
        </div>
        <el-empty description="來添加提醒項目吧！" v-if="!store.noteList[0]" />
    </main>
    <ItemDialog :open_itemDialog="open_itemDialog" @close_itemDialog="closeItemDialog" />
</template>
<style lang="scss" scoped></style>
