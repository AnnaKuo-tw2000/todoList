<script setup>
import { ElMessage } from "element-plus";
import { useCounterStore } from '@/stores/counter';

const { proxy } = getCurrentInstance();
const store = useCounterStore();
// 彈窗相關資料
const props = defineProps(['open_itemDialog', 'elementPlusLocale', 'selectId']);
const emits = defineEmits(['close_itemDialog', 'shouldRemind']);
const title = ref('');
const content = ref('');
const completionDate = ref('');
const reminderDuration = ref('');
const reminderTime = ref('');

let editingNote = null;
watchEffect(() => {
    if (props.selectId) {
        editingNote = store.noteList.find((item) => item.id === props.selectId);
        if (editingNote) {
            // 如果是編輯現有筆記，將表單填充為現有筆記的值
            title.value = editingNote.title;
            content.value = editingNote.content;
            completionDate.value = editingNote.completionDate;
            reminderDuration.value = editingNote.reminderDuration;
            reminderTime.value = editingNote.reminderTime;
            // console.log('editingNote', editingNote);
            // console.log(title.value);
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
            reminderDuration: reminderDuration.value,
            reminderTime: reminderTime.value,
            isComplete: false,
            isFavorite: 0,
            shouldRemind: false,
        };
        // 計算出提醒時間，在新增的時候計算一次
        if (
            newNote.completionDate
            && (newNote.reminderDuration || newNote.reminderDuration === 0)
            && newNote.reminderTime
        ) {
            newNote.reminderTimestamp = proxy.$dayjs(newNote.completionDate)
                // 減去前幾天的值
                .subtract(newNote.reminderDuration, 'day')
                .hour(newNote.reminderTime.getHours())
                .minute(newNote.reminderTime.getMinutes())
                .second(newNote.reminderTime.getSeconds())
                // 將dayjs物件轉為js的Date物件
                .toDate();
        }
        if (editingNote) {
            // 如果正在編輯現有筆記，則替換現有筆記
            const index = store.noteList.findIndex((item) => item.id === editingNote.id);
            if (index !== -1) {
                store.noteList.splice(index, 1, newNote);
            }
        } else {
            // 如果是創建新筆記，則將新筆記添加到列表中
            store.noteList.push(newNote);
            // console.log(completionDate.value);
            // console.log(reminderTime.value);
        }
        // handleReminder();
        title.value = '';
        content.value = '';
        completionDate.value = '';
        reminderDuration.value = '';
        reminderTime.value = '';
        store.saveToLocalStorage();
        emits('close_itemDialog');
    }
};
// select選擇器

const options = [
    {
        value: '0',
        label: store.isTwLocale === true ? '當天' : 'that day',
    },
    {
        value: '1',
        label: store.isTwLocale === true ? '前一天' : 'one day',
    },
    {
        value: '3',
        label: store.isTwLocale === true ? '前三天' : 'three days',
    },
    {
        value: '5',
        label: store.isTwLocale === true ? '前五天' : 'five days',
    },
    {
        value: '7',
        label: store.isTwLocale === true ? '前一週' : 'a week',
    },
];
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
                <font-awesome-icon :icon="['far', 'calendar-check']" class="p-[1.745px]" />
                <el-config-provider :locale="props.elementPlusLocale">
                    <el-date-picker v-model="completionDate" type="date"
                        :placeholder="store.isTwLocale === true ? '預計完成日' : 'Expected completion date'"
                        prefix-icon="null" />
                </el-config-provider>
            </div>
            <div class="flex items-center">
                <i-ep-AlarmClock class="p-[0.86px] shrink-0" />
                <el-config-provider :locale="props.elementPlusLocale">
                    <el-select v-model="reminderDuration" class=""
                        :placeholder="store.isTwLocale === true ? '提前提醒' : 'Remind in advance'" :disabled="!completionDate">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                    <el-time-picker v-model="reminderTime"
                        :placeholder="store.isTwLocale === true ? '提醒時間' : 'Reminder time'" prefix-icon="null"
                        :disabled="!completionDate" />
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
