<script setup>
import { useCounterStore } from '../stores/counter';

const store = useCounterStore();
</script>
<template>
    <footer class="todoList__footer bg-primary dark:bg-dkPrimary" :class="{ dark: isDark }">
        <el-button plain round class="todoList__filterBtn" :class="{ active: store.filterStatus === 'all' }"
            @click="store.filterStatus = 'all'">{{ store.isTwLocale === true ? '全部' : 'All' }}</el-button>
        <el-button plain round class="todoList__filterBtn" :class="{ active: store.filterStatus === 'favorite' }"
            @click="store.filterStatus = 'favorite'">
            <font-awesome-icon :icon="['fas', 'fa-heart']" style="color:#f5619c" />
        </el-button>
        <el-button plain round class="todoList__filterBtn" :class="{ active: store.filterStatus === 'completed' }"
            @click="store.filterStatus = 'completed'">{{ store.isTwLocale === true ? '已完成' : 'Completed' }}</el-button>
        <el-button plain round class="todoList__filterBtn" :class="{ active: store.filterStatus === 'incomplete' }"
            @click="store.filterStatus = 'incomplete'">{{ store.isTwLocale === true ? '未完成' : 'Incomplete' }}</el-button>

    </footer>
</template>
<style lang="scss" scoped>
.todoList__footer {
    @apply flex justify-evenly items-start py-4;
    position: relative;
    z-index: 0;

    .todoList__filterBtn {
        &.el-button {
            position: relative;
            border: none;

            &:before {
                content: '';
                width: 100%;
                height: 0;
                position: absolute;
                bottom: 50%;
                z-index: -1;
                background-color: white;
                transition: height .3s;
            }

            &.active {
                @apply text-primary;

                &::before {
                    height: 32px;
                }
            }
        }
    }

    &.dark {
        .todoList__filterBtn {
            &.el-button {
                &:before {
                    @apply bg-dkSecondary;
                }

                &.active {
                    @apply text-dkTertiary bg-dkSecondary;
                }
            }
        }
    }
}
</style>
