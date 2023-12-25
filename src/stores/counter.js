import { ref } from "vue";
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", () => {
    const noteList = ref([]);
    const filterStatus = ref("all");
    const isTwLocale = ref(navigator.language === "zh-TW");
    const show_searchInput = ref(false);

    // 將 noteList 中的數據轉換為 JSON 字符串並存儲到瀏覽器的本地存儲（localStorage）中.
    const saveToLocalStorage = () => {
        localStorage.setItem("noteList", JSON.stringify(noteList.value));
    };
    const filterNoteList = computed(() => {
        switch (filterStatus.value) {
            case "incomplete":
                return noteList.value.filter((note) => !note.isComplete);
            case "completed":
                return noteList.value.filter((note) => note.isComplete);
            case "favorite":
                const favoriteNotes = noteList.value.filter(
                    (note) => note.isFavorite === 1
                );
                const sortedFavoriteNotes = favoriteNotes.sort(
                    (a, b) =>
                        new Date(a.completionDate) - new Date(b.completionDate)
                );
                return sortedFavoriteNotes;
            default:
                return noteList.value;
        }
    });
    const showEmpty = computed(
        () => noteList.value.length > 0 && filterNoteList.value.length === 0
    );

    return {
        noteList,
        filterStatus,
        filterNoteList,
        isTwLocale,
        saveToLocalStorage,
        showEmpty,
    };
});
