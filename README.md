# bilibili-live-checker

 A chrome extension can auto check live room status and create notification

Chrome擴充功能，自動檢查B站直播間狀態並發送通知

## 功能截圖

測試環境:

- Chrome / Edge on Windows 11
- Chrome on MacOS Ventura 13

![Screenshot 202023-10-23 20122859.png](./images/Screenshot%202023-10-23%20122859.png)

![Screenshot 202023-10-23 20123821.png](./images/Screenshot%202023-10-23%20123821.png)

![Screenshot 202023-10-23 20124324.png](./images/Screenshot%202023-10-23%20124324.png)
![Screenshot 202023-10-24 20045645.png](./images/Screenshot%202023-10-24%20045645.png)

![Screenshot 202023-10-24 20045654.png](./images/Screenshot%202023-10-24%20045654.png)

## 預計實現功能及備忘錄(隨時可能異動)

* [X] 跨域呼叫Bilibili REST API查詢主播直播間狀態
* [X] 當直播間狀態為開播中時調用chrome.notification送出通知(MacOS同時多位主播合併訊息成一筆)
* [X] 後端腳本(service worker)不進入休眠(inactive)
* [X] 主播空間頁面嵌入開播通知按鈕
* [X] 編輯監控主播id清單(初版，尚有改進空間)
* [X] 觀看目前監控主播直播間基本資訊(直播間標題、主播id、直播間id、直播間狀態及直播間人數等)
* [X] 監控主播清單跳轉直播間頁面
* [ ] 調整檢查頻率(API呼叫)
* [ ] Discord通知方式
* [ ] 國際化
* [ ] 重構

## 使用到第三方資源

1. 擴充主icon來自B站up [Nakki](https://space.bilibili.com/121042172)的動態([森林显薇镜 - 波波和步拨的较量( ；´Д｀)](https://www.bilibili.com/opus/851160435288703011))

## 參考資料

TBD
