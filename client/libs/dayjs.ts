import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/vi';

dayjs.locale('vi');

const config = {
  thresholds: [
    { l: 's', r: 1 },
    { l: 'ss', r: 59, d: 'second' },
    { l: 'm', r: 1 },
    { l: 'mm', r: 59, d: 'minute' },
    { l: 'h', r: 1 },
    { l: 'hh', r: 23, d: 'hour' },
    { l: 'd', r: 1 },
    { l: 'dd', r: 6, d: 'day' },
    { l: 'w', r: 1 },
    { l: 'ww', r: 4, d: 'week' },
    { l: 'M', r: 1 },
    { l: 'MM', r: 11, d: 'month' },
    { l: 'y', r: 1 },
    { l: 'yy', d: 'year' },
  ],
};
dayjs.extend(relativeTime, config);
dayjs.extend(updateLocale);

dayjs.updateLocale('vi', {
  relativeTime: {
    future: '%s tới',
    past: '%s trước',
    s: 'vài giây',
    ss: '%d giây',
    m: '%d phút',
    mm: '%d phút',
    h: '%d giờ',
    hh: '%d giờ',
    d: '%d ngày',
    dd: '%d ngày',
    w: '%d tuần',
    ww: '%d tuần',
    M: '%d tháng',
    MM: '%d tháng',
    y: '%d năm',
    yy: '%d năm',
  },
});

export function dayFromNow(date: string) {
  return dayjs(date).fromNow();
}

export function dayPublish(date: string) {
  return dayjs(date).format('HH:mm DD/MM/YYYY');
}
