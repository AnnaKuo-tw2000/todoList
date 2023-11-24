<script setup>
// 現在會自動引入用到的Vue3 API，所以不再需要手動import { ref/computed } 這些東西了
import { dayjs } from 'element-plus';

const curDate = dayjs().format('DD');
const curYear = dayjs().format('YYYY');
const curMonth = dayjs().format('MMM');
const curTime = dayjs().format('hh:mm:ss A');
const curDay = dayjs().format('ddd');

const addTaskInput = ref('');
const headerRef = ref(null);
const footerRef = ref(null);
const checkA = ref(false);

const todoListMainStyle = computed(() => {
    const headerHeight = headerRef.value?.offsetHeight || 0;
    const footerHeight = footerRef.value?.offsetHeight || 0;
    return { height: `calc(var(--vh, 1vh) * 100 - ${headerHeight}px - ${footerHeight}px)` };
});
</script>

<template>
    <div>
        <header class="todoList__header bg-primary p-4" ref="headerRef">
            <section class="flex justify-between items-center mb-5">
                <div class="flex">
                    <div class="flex items-center mr-1">
                        <div class="text-4xl mr-1">{{ curDate }}</div>
                        <div class="">
                            <div class="leading-none">{{ curYear }}</div>
                            <div class="leading-none">{{ curMonth }}</div>
                        </div>
                    </div>
                    <div class="self-end">{{ curTime }}</div>
                </div>
                <div class="text-xl">{{ curDay }}</div>
            </section>
            <el-input v-model="addTaskInput" placeholder="+ Add task" class="el-input__rounded-full">
                <template #suffix>
                    <div class="el-input__suffixIcon--plus bg-primary rounded-full">
                        <font-awesome-icon icon="plus" class="text-white text-xl" />
                    </div>
                </template>
            </el-input>
        </header>
        <main class="todoList__main px-4 py-5" :style="todoListMainStyle">
            <section>
                <div class="flex justify-between items-center">
                    <el-checkbox v-model="checkA" label="HelloA" />
                    <div class="text-tertiary">
                        <font-awesome-icon :icon="['fas', 'pen-to-square']" class="mx-2" />
                        <font-awesome-icon :icon="['fas', 'trash-can']" class="mx-2" />
                        <font-awesome-icon :icon="['far', 'star']" class="mx-2" />
                    </div>
                </div>
                <div class="ml-6 text-tertiary text-xs">
                    <font-awesome-icon :icon="['far', 'bell']" class="mr-2" />
                </div>
            </section>
        </main>
        <footer class="todoList__footer" ref="footerRef">
            <div>
                <el-button plain>Plain</el-button>
            </div>
        </footer>
    </div>
</template>

<style lang="scss" scoped>
.el-input__suffixIcon--plus {
    height: 28px;
    width: 28px;
}

.todoList__main {
    overflow: auto;
}

:deep() {
    .el-input__wrapper {
        @apply pl-4;
        padding-right: 3px;
    }
}
</style>
