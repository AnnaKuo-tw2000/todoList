<script setup>
// main區塊高度計算
onMounted(() => {
    const headerHeight = document.querySelector('header.todoList__header')?.offsetHeight || 0;
    const footerHeight = document.querySelector('footer.todoList__footer')?.offsetHeight || 0;
    const mainEle = document.querySelector('main.todoList__main');
    mainEle.style.height = `calc(var(--vh, 1vh) * 100 - ${headerHeight}px - ${footerHeight}px)`;
});
</script>

<template>
    <div class="text-txPrimary dark:text-dkTxPrimary">
        <TheHeader />
        <MainContent />
        <TheFooter />
    </div>
</template>

<style lang="scss" scoped></style>
