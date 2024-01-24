import { ref } from "vue";
import { defineStore } from "pinia";

export const useLanguageStore = defineStore("language", () => {
    const isTwLocale = ref(navigator.language === "zh-TW");

    return {
        isTwLocale,
    };
});
