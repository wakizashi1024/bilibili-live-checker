let watch_list = [];
chrome.storage.local.get(["watch_list"]).then((res) => {
  console.log(res)
  watch_list = res["watch_list"] ?? [];
  console.log(watch_list)

  // console.log((new URL(window.location.href)).pathname.split("/")[1]);
  const uid = new URL(window.location.href).pathname.split("/")[1];

  const btn = document.createElement("span");
  btn.classList.add("h-f-btn");

  btn.textContent = !watch_list.includes(uid) ? "開播時通知" : "開播不通知";
  btn.addEventListener("click", async () => {
    console.log("clicked");
    watch_list = (await chrome.storage.local.get(["watch_list"]))["watch_list"] ?? [];

    // watch_list = [...new Set([...watch_list, uid])];
    if (!watch_list.includes(uid)) {
      watch_list = [...watch_list, uid];
    } else {
      watch_list = watch_list.filter((item) => item !== uid);
    }

    console.log("watch_list", watch_list);
    await chrome.storage.local.set({ watch_list: watch_list });
    console.log(await chrome.storage.local.get(["watch_list"]));

    btn.textContent = !watch_list.includes(uid) ? "開播時通知" : "開播不通知";
    window.alert("操作成功");
  });

  const appendBtn = () => {
    const page_actions = document.querySelector(".h-action");
    // console.log(page_actions)
    const ref_follow_btn = document.querySelector(".h-follow");
    const ref_unfollow_btn = document.querySelector(".h-unfollow");
    // console.log(ref_btn)

    if (page_actions && (ref_unfollow_btn || ref_follow_btn)) {
      if (ref_unfollow_btn) {
        page_actions.insertBefore(btn, ref_unfollow_btn);
      } else {
        page_actions.insertBefore(btn, ref_follow_btn);
      }
      console.log("button inserted");
    } else {
      console.log("not ready, waiting for 1s to retry");
      setTimeout(appendBtn, 1000);
    }
  };

  appendBtn();
});
