import { formatedTimeStringFromTimeStamp, get_status_info_by_uids, uuid } from "./utils.js";

const checkStatus = async () => {
  console.log(
    `-----------------------checkStatus start at ${new Date()}------------------------`
  );

  const uids =
    (await chrome.storage.local.get(["watch_list"]))["watch_list"] ?? [];

  //   const data = Object.fromEntries(
  //     Object.entries(data).filter(([uid, info]) => info.live_status === 1)
  //   );
  const data = await get_status_info_by_uids(uids);
  const meta = [];
  const platform = await chrome.runtime.getPlatformInfo();
  console.log(platform);
  for (let [uid, info] of Object.entries(data)) {
    console.log(uid, info.live_status, info.live_time);
    let storage_info = (await chrome.storage.local.get([`${uid}`]))[uid] ?? {};
    console.log(
      `last ${uid} storage_info: ${JSON.stringify(storage_info, null, 2)}`
    );
    if (
      info.live_status === 1 &&
      (Object.keys(storage_info).length === 0 ||
        info.live_time > storage_info.last_live_time)
    ) {
      if (platform.os !== "mac") {
        chrome.notifications.create(`live_notification_one-${uuid()}: ${info.room_id}`, {
          type: "basic",
          iconUrl: info.face,
          title: `您關注的主播"${info.uname}"開播了，快去直播間(${info.room_id})看看吧！`,
          //   message: `直播間標題: ${info.title}\n開播時間: ${new Date(
          //     info.live_time * 1e3
          //   ).toLocaleTimeString("sv")}`,
          message: `直播間標題: ${
            info.title
          }\n開播時間: ${formatedTimeStringFromTimeStamp(info.live_time)}`,
        });
      } else {
        meta.push({
          info,
        });
      }
    }

    storage_info.live_status = info.live_status;
    console.log(info.live_time);
    storage_info.last_live_time =
      info.live_time === 0 ? storage_info.last_live_time ?? 0 : info.live_time;
    console.log(
      `new ${uid} storage_info: ${JSON.stringify(storage_info, null, 2)}`
    );
    await chrome.storage.local.set({
      [uid]: {
        live_status: storage_info.live_status,
        last_live_time: storage_info.last_live_time,
      },
    });
    // console.log(await chrome.storage.local.get([`${uid}`]));
  }

  console.log(meta);
  if (meta.length > 0) {
    if (meta.length === 1) {
      chrome.notifications.create(`live_notification_one-${uuid()}: ${meta[0].info.room_id}`, {
        type: "basic",
        iconUrl: meta[0].info.face,
        title: `您關注的主播"${meta[0].info.uname}"開播了，快去直播間(${meta[0].info.room_id})看看吧！`,
        // message: `直播間標題: ${meta[0].info.title}\n開播時間: ${new Date(
        //   meta[0].info.live_time* 1e3
        // ).toLocaleTimeString("sv")}`,
        message: `直播間標題: ${
          meta[0].info.title
        }\n開播時間: ${formatedTimeStringFromTimeStamp(
          meta[0].info.live_time
        )}`,
      });
    } else {
      //   const _messages = meta
      //     .map(
      //       (info) =>
      //         `${info.uname}(${info.room_id})，直播間標題: ${
      //           info.title
      //         }\n開播時間: ${new Date(info.live_time* 1e3).toLocaleTimeString("sv")}`
      //     )
      //     .join("\n");
    //   const _messages = meta
    //     .map(
    //       (m) =>
    //         `${m.info.uname}(${m.info.room_id})，直播間標題: ${
    //           m.info.title
    //         }\n開播時間: ${formatedTimeStringFromTimeStamp(m.info.live_time)}`
    //     )
    //     .join("\n");
        const _messages = meta.map((m) => `${m.info.uname}(${m.info.room_id})`).join("\n");
        const _room_ids = meta.map((m) => m.info.room_id);
        chrome.notifications.create(`live_notification_multi-${uuid()}: [${_room_ids.join(", ")}]`, {
            type: "basic",
            iconUrl: "images/icon128.png",
            title: `您關注的${meta.length}位主播開播了，快去看看吧！`,
            message: _messages,
        });
    }
  }

  console.log(
    `-----------------------checkStatus end at ${new Date()}------------------------`
  );
};

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.clear();
});

self.addEventListener("activate", async () => {
  await checkStatus();

  await chrome.alarms.create("checkStatus", { delayInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "checkStatus") {
    try {
      await checkStatus();
      console.log(await chrome.alarms.getAll());
    } finally {
      await chrome.alarms.create("checkStatus", { delayInMinutes: 1 });
      console.log("Next checkStatus is registed ");
    }
  }
});

chrome.notifications.onClicked.addListener(async (notificationId) => {
    if (notificationId.includes("live_notification_one-")) {
        const room_id = notificationId.split(":")[1].trim();
        
        // console.log(notificationId, room_id)
        await chrome.tabs.create({
            url: `https://live.bilibili.com/${room_id}`,
        });
    } else if (notificationId.includes("live_notification_multi-")) {
        const room_ids = notificationId.split(":")[1].trim().replace(/[\[\]]/g, "").split(",").map(str => str.trim());
        // console.log(notificationId, room_ids)
        room_ids.map((room_id) => {
            chrome.tabs.create({
                url: `https://live.bilibili.com/${room_id}`,
            });
        });
    }
})

const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();
