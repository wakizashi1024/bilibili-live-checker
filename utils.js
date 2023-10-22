export const formatedTimeStringFromTimeStamp = (time) => {
    const timeStamp = time * 1e3;
    return new Date(timeStamp).toLocaleString("sv");
}