<script setup>
import { useCounterStore } from '@/stores/counter';

const store = useCounterStore();
const { proxy } = getCurrentInstance();

const props = defineProps(['dialogTableVisible']);
const emits = defineEmits(['close_tableDialog']);

// 需呈現在彈窗的提醒事項
const data = computed(() => store.noteList.filter((note) => note.reminderTimestamp && !note.isComplete)
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
    <el-dialog :model-value="props.dialogTableVisible" width="60%"
        :title="store.isTwLocale === true ? '提醒事項' : 'Reminder items'" @close="emits('close_tableDialog')">
        <el-table :data="data">
            <el-table-column property="title" :label="store.isTwLocale === true ? '標題' : 'Title'" />
            <el-table-column property="completionDate" :label="store.isTwLocale === true ? '完成日' : 'Completion Date'"
                width="130px" />
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
