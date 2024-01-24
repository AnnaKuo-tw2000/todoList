<script setup>
import { useNoteStateStore } from '@/stores/noteState';
import { useLanguageStore } from '@/stores/language';

const noteStateStore = useNoteStateStore();
const languageStore = useLanguageStore();
const { proxy } = getCurrentInstance();

const props = defineProps(['open_tableDialog']);
const emits = defineEmits(['close_tableDialog']);

// 需呈現在彈窗的提醒事項
const data = computed(() => noteStateStore.noteList.filter((note) => note.reminderTimestamp && !note.isComplete)
    .map((note) => ({
        ...note,
        completionDate: formatCompletionDate(note.completionDate)
    })));

// 格式化預計完成日
function formatCompletionDate(date) {
    return proxy.$dayjs(date).format('YYYY-MM-DD');
}

</script>
<template>
    <el-dialog :model-value="props.open_tableDialog" width="60%"
        :title="languageStore.isTwLocale === true ? '提醒事項' : 'Reminder items'" @close="emits('close_tableDialog')">
        <el-table :data="data" :empty-text="languageStore.isTwLocale === true ? '沒有要提醒的項目' : 'no alarm item'">
            <el-table-column property="title" :label="languageStore.isTwLocale === true ? '標題' : 'Title'" />
            <el-table-column property="completionDate"
                :label="languageStore.isTwLocale === true ? '完成日' : 'Completion Date'" width="140px" />
        </el-table>
    </el-dialog>
</template>
<style lang="scss" scoped>
.el-button--text {
    margin-right: 15px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>
