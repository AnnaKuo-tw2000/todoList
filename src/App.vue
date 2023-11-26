<script setup>
import { RouterView } from 'vue-router';

function initViewHeight() {
    const root = document.documentElement;
    root.style.setProperty('--vh', `${window.innerHeight / 100}px`);
    window.addEventListener('resize', () => {
        root.style.setProperty('--vh', `${window.innerHeight / 100}px`);
    });
}

onMounted(() => {
    initViewHeight();
});
</script>

<template>
    <RouterView />
</template>

<style lang="scss"></style>
