<script setup>
import { useDark } from '@vueuse/core';
import { useNoteStateStore } from '../stores/noteState';
import { useLanguageStore } from '../stores/language';

const noteStateStore = useNoteStateStore();
const languageStore = useLanguageStore();
const isDark = useDark();
</script>

<template>
    <footer
        class="todoList__footer bg-primary dark:bg-dkPrimary  border-t border-txTertiary dark:border-dkTxSecondary shadow-gray-300 dark:shadow-gray-500"
        :class="{ dark: isDark }">
        <el-button plain round class="todoList__filterBtn" :class="{ active: noteStateStore.filterStatus === 'all' }"
            @click="noteStateStore.filterStatus = 'all'">{{ languageStore.isTwLocale === true ? '全部' : 'All' }}</el-button>
        <el-button plain round class="todoList__filterBtn" :class="{ active: noteStateStore.filterStatus === 'favorite' }"
            @click="noteStateStore.filterStatus = 'favorite'">
            <font-awesome-icon :icon="['fas', 'fa-heart']" style="color:#f5619c" />
        </el-button>
        <el-button plain round class="todoList__filterBtn" :class="{ active: noteStateStore.filterStatus === 'completed' }"
            @click="noteStateStore.filterStatus = 'completed'">{{ languageStore.isTwLocale === true ? '已完成' : 'Completed'
            }}</el-button>
        <el-button plain round class="todoList__filterBtn" :class="{ active: noteStateStore.filterStatus === 'incomplete' }"
            @click="noteStateStore.filterStatus = 'incomplete'">{{ languageStore.isTwLocale === true ? '未完成' : 'Incomplete'
            }}</el-button>

    </footer>
</template>

<style lang="scss" scoped>
.todoList__footer:deep() {
    @apply flex justify-evenly items-start py-4;
    position: relative;
    z-index: 0;
    box-shadow: 0 -2px 7px -4px;

    .todoList__filterBtn {
        &.el-button {
            position: relative;
            border: none;
            @apply bg-secondary;

            &:before {
                content: '';
                width: 100%;
                height: 0;
                position: absolute;
                bottom: 50%;
                z-index: -1;
                transition: height .3s;
                box-shadow: 0 -10px var(--tw-shadow-color);
                @apply bg-secondary shadow-secondary;
            }

            &.active {
                @apply text-primary;

                &::before {
                    height: 33px;
                }
            }
        }
    }
}

.todoList__footer.dark:deep() {
    box-shadow: 0 -2px 10px -4px;

    .todoList__filterBtn {
        &.el-button {
            @apply bg-transparent;

            &:before {
                @apply bg-dkSecondary shadow-dkSecondary;
            }

            &.active {
                @apply text-dkTertiary bg-dkSecondary;
            }

        }
    }
}
</style>
