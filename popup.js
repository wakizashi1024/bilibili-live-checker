import { formatedTimeStringFromTimeStamp, get_status_info_by_uids } from "./utils.js";

const live_status_string = ["未開播", "直播中", "輪播中"];
const broadcast_type_string = ["PC端", "手機端"];

let watched_list = [];
const text_el = document.querySelector("#text-watch-list");

const refresh_watched_list = async () => {
    watched_list = (await chrome.storage.local.get(["watch_list"]))["watch_list"] ?? [];
    // const text_el = document.createElement("textarea");
    // text_el.setAttribute("id", "text-watch-list");
    text_el.value = watched_list.join(", ");
}

const update_up_list = async () => {
    const up_list_el = document.querySelector("#up-list");
    const list_data = await get_status_info_by_uids(watched_list); 
    console.log(list_data)
    up_list_el.tBodies[0].innerHTML = Object.entries(list_data).sort(([a_uid, a_info], [b_uid, b_info]) => {
        if (a_info.live_status === 1 && b_info.live_status === 1) {
            return b_info.live_time - a_info.live_time; // The lastest liver show first
        } else if (a_info.live_status === 1 && b_info.live_status !== 1) {
            return -1;
        } else if (a_info.live_status !== 1 && b_info.live_status === 1) {
            return 1;
        }

        if (a_info.live_status === b_info.live_status) {
            return a_info.uid - b_info.uid;
        }
        return a_info.live_status - b_info.live_status;
    }).map(([uid, info]) => {
        // console.log(info)
        return (
            `<tr>
                <td>
                    <div style="padding-top: 2px; padding-bottom: 2px">
                        <img src="${info.face}" style="width: 48px; height: 48px; border-radius: 48px"><br>
                        ${info.uname}<br>
                        ${info.uid}
                    </div>
                </td>
                <td>${live_status_string[info.live_status]}</td>
                <td>${info.title}</td>
                <td>${info.live_time !== 0 ? formatedTimeStringFromTimeStamp(info.live_time).split(" ").join("<br>") : "N/A"}</td>
                <td>${info.area_name}</td>
                <td>${broadcast_type_string[info.broadcast_type]}</td>
                <td>
                    <div class="action-area">
                        <a class="remove_from_watch_list" href="${info.uid}">取消訂閱</a>
                        <a class="open_room_tab" href="https://live.bilibili.com/${info.room_id}">開啟直播間<br>${info.room_id}</a>
                    </div>
                </td>
            </tr>`
        );
    }).join("\n");

    document.querySelectorAll(".open_room_tab").forEach((el) => {
        el.addEventListener("click", async (evt) => {
            evt.preventDefault();
            await chrome.tabs.create({
                url: `${el.getAttribute("href")}`,
            });
        });
    });

    document.querySelectorAll(".remove_from_watch_list").forEach((el) => {
        el.addEventListener("click", async (evt) => {
            evt.preventDefault();
            
            if(window.confirm("確定要取消訂閱嗎?")) {
                watched_list = watched_list.filter((uid) => uid !== el.getAttribute("href"));
                await chrome.storage.local.set({"watch_list": watched_list});
                await refresh_watched_list();
                await update_up_list();

                window.alert("操作成功");
            }
        });
    });
}

const switch_func_tab = (evt, tab_name) => {
    const func_tabs_link = document.querySelectorAll(".tablinks");
    const func_tabs_content = document.querySelectorAll(".func-tab-content");

    func_tabs_link.forEach((el) => {
        el.classList.remove("active");
    })

    func_tabs_content.forEach((el) => {
        el.style.display = "none";
    });

    evt.currentTarget.classList.add("active");
    document.querySelector(`#${tab_name}`).style.display = "block";
}

document.addEventListener("DOMContentLoaded", async () => {
    // Fix edge layout bug on Windows 11 testing
    document.querySelector("html").style.width = "640px";
    document.querySelector("html").style.height = "480px";
    setTimeout(() => {
        document.querySelector("html").style.width = "800px";
        document.querySelector("html").style.height = "600px";
    }, 1);

    const func_tabs_link = document.querySelectorAll(".tablinks");
    func_tabs_link.forEach((el) => {
        el.addEventListener("click", (evt) => {
            switch_func_tab(evt, el.getAttribute("func_tab"));
        })
    })
    
    await refresh_watched_list();
    
    document.querySelector(".func-tab >.tablinks[func_tab=tab-up-info]").click();
    
    await update_up_list();

    const submit_btn = document.querySelector("#submit-btn");
    submit_btn.addEventListener("click", async () => {
        await chrome.storage.local.set({ "watch_list": text_el.value.split(",").map((str) => str.trim()) });
        
        await refresh_watched_list();
        await update_up_list();
        window.alert("操作成功");
    });

    const refresh_btn = document.querySelector("#refresh-btn");
    refresh_btn.addEventListener("click", async () => {
        // await refresh_watched_list();
        await update_up_list();
    });
});
