    const searchTxt = ref("");
        // 過濾含有關鍵字的項目
        return result.filter((note) =>
            searchTxt.value ? note.title.includes(searchTxt.value) : true
        );
