<script setup>
import { RouterView } from 'vue-router';

function initViewHeight() {
    const root = document.documentElement;
    const windowVhUnit = window.innerHeight / 100;
    root.style.setProperty('--vh', `${windowVhUnit}px`);
    window.addEventListener('resize', () => {
        root.style.setProperty('--vh', `${windowVhUnit}px`);
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
