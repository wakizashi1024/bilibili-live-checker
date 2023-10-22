document.addEventListener("DOMContentLoaded", async () => {
    document.getElementsByTagName("html")[0].style.width = "800px";
    document.getElementsByTagName("html")[0].style.height = "600px";

    let watched_list = (await chrome.storage.local.get(["watch_list"]))["watch_list"] ?? [];
    // document.querySelector("#app").textContent = watched_list.join("\n");
    const text_el = document.createElement("textarea");
    text_el.setAttribute("id", "text-watch-list");
    text_el.value = watched_list.join(", ");
    const submit_btn = document.createElement("button");
    submit_btn.textContent = "更新";
    submit_btn.addEventListener("click", async () => {
        await chrome.storage.local.set({ "watch_list": text_el.value.split(",").map((str) => str.trim()) });
        watched_list = (await chrome.storage.local.get(["watch_list"]))["watch_list"] ?? [];
        document.querySelector("#text-watch-list").value = watched_list.join(", ");
        window.alert("操作成功");
    })
    document.querySelector("#app").appendChild(text_el);
    document.querySelector("#app").appendChild(submit_btn);
})
