export const formatedTimeStringFromTimeStamp = (time) => {
    const timeStamp = time * 1e3;
    return new Date(timeStamp).toLocaleString("sv");
}

export const get_status_info_by_uids = async (uids) => {
  const base_url = `https://api.live.bilibili.com/room/v1/Room/get_status_info_by_uids?${uids.join("&uids[]=")}`;

  console.log(base_url);

  const response = await fetch(base_url);
  const json = await response.json();
  const data = json.data;

  return data;
}

export const uuid = () => {
    return crypto.randomUUID();
}