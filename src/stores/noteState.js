import { ref } from "vue";
import { defineStore } from "pinia";

export const useNoteStateStore = defineStore("noteState", () => {
    const noteList = ref([]);
    const filterStatus = ref("all");
    const searchTxt = ref("");

    // 將 noteList 中的數據轉換為 JSON 字符串並存儲到瀏覽器的本地存儲（localStorage）中.
    const saveToLocalStorage = () => {
        localStorage.setItem("noteList", JSON.stringify(noteList.value));
    };
    const filterNoteList = computed(() => {
        let result;
        // 根據項目狀態進行過濾
        switch (filterStatus.value) {
            case "incomplete":
                result = noteList.value.filter((note) => !note.isComplete);
                break;
            case "completed":
                result = noteList.value.filter((note) => note.isComplete);
                break;
            case "favorite":
                const favoriteNotes = noteList.value.filter(
                    (note) => note.isFavorite === 1
                );
                const sortedFavoriteNotes = favoriteNotes.sort(
                    (a, b) =>
                        new Date(a.completionDate) - new Date(b.completionDate)
                );
                result = sortedFavoriteNotes;
                break;
            default:
                result = noteList.value;
        }
        // 過濾含有關鍵字的項目
        return result.filter((note) =>
            searchTxt.value ? note.title.includes(searchTxt.value) : true
        );
    });
    const showEmpty = computed(
        () => noteList.value.length > 0 && filterNoteList.value.length === 0
    );

    return {
        noteList,
        filterStatus,
        filterNoteList,
        saveToLocalStorage,
        showEmpty,
        searchTxt,
    };
});
