import dayjs from 'dayjs';

// 현재의 날짜 및 시간을 YYYY-MM-DD HH:mm:ss 포맷으로 반환하는 함수이다.
export function getNowDate() {
    const nowDate = Date.now();
    const date = dayjs(nowDate).format('YYYY-MM-DD HH:mm:ss');
    return date;
}
