<script setup>
import { ElMessage } from "element-plus";
import { useCounterStore } from '../stores/counter';

const store = useCounterStore();
// 彈窗相關資料
const props = defineProps(['open_itemDialog', 'elementPlusLocale']);
const emits = defineEmits(['close_itemDialog']);
const title = ref('');
const content = ref('');
const completionDate = ref('');
const reminderTime = ref('');

let editingNote = null;
watchEffect(async () => {
    if (store.paramsId) {
        editingNote = store.noteList.find((item) => item.id === store.paramsId);
        if (editingNote) {
            // 如果是編輯現有筆記，將表單填充為現有筆記的值
            title.value = editingNote.title;
            content.value = editingNote.content;
            completionDate.value = editingNote.completionDate;
            reminderTime.value = editingNote.reminderTime;
            console.log('editingNote', editingNote);
            console.log(title.value);
            await nextTick();
        }
        store.paramsId = '';
    }
});

// 編輯彈窗
const saveNoteAndNavigate = () => {
    if (!title.value) {
        if (store.isTwLocale === true) {
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
        // 如果標題有值，則創建和編輯的事項同一個id的物件，
        const newNote = {
            id: editingNote ? editingNote.id : Date.now(),
            title: title.value,
            content: content.value,
            completionDate: completionDate.value,
            reminderTime: reminderTime.value,
            isComplete: false,
            isFavorite: 0,
        };

        if (editingNote) {
            // 如果正在編輯現有筆記，則替換現有筆記
            const index = store.noteList.findIndex((item) => item.id === editingNote.id);
            if (index !== -1) {
                store.noteList.splice(index, 1, newNote);
            }
        } else {
            // 如果是創建新筆記，則將新筆記添加到列表中
            store.noteList.push(newNote);
        }
        title.value = '';
        content.value = '';
        completionDate.value = '';
        reminderTime.value = '';
        emits('close_itemDialog');
        store.saveToLocalStorage();
    }
};
</script>
<template>
    <el-dialog :model-value="props.open_itemDialog" :title="store.isTwLocale === true ? '增加細項' : 'Add task'" width="65%"
        draggable @close="emits('close_itemDialog')">
        <main>
            <div class="flex items-center">
                <i-ep-CollectionTag />
                <el-input v-model="title" :placeholder="store.isTwLocale === true ? '標題' : 'Title'" clearable />
            </div>
            <div class="flex items-center">
                <i-ep-Document />
                <el-input v-model="content" :placeholder="store.isTwLocale === true ? '詳情' : 'Content'" clearable />
            </div>
            <div class="flex items-center">
                <font-awesome-icon :icon="['far', 'calendar-check']" />
                <el-config-provider :locale="props.elementPlusLocale">
                    <el-date-picker v-model="completionDate" type="date"
                        :placeholder="store.isTwLocale === true ? '預計完成日' : 'Expected completion date'"
                        prefix-icon="null" />
                </el-config-provider>
            </div>
            <div class="flex items-center">
                <font-awesome-icon :icon="['far', 'clock']" />
                <el-config-provider :locale="props.elementPlusLocale">
                    <el-time-picker v-model="reminderTime"
                        :placeholder="store.isTwLocale === true ? '提醒時間' : 'Reminder time'" prefix-icon="null" />
                </el-config-provider>
            </div>
        </main>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="emits('close_itemDialog')">{{ store.isTwLocale === true ? '取消' : 'Cancel' }}</el-button>
                <el-button type="primary" :plain="true" @click="saveNoteAndNavigate">
                    {{ store.isTwLocale === true ? '確認' : 'Confirm' }}
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<style lang="scss" scoped>
:deep(.el-input) {
    .el-input__wrapper {
        box-shadow: none;
    }

    .el-input__prefix {
        display: none;
    }
}
</style>
