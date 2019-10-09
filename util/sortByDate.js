import parseDate from './parseDate';

export default function(a, b) {
  return a.timeStamp > b.timeStamp ? 1 : a.timeStamp < b.timeStamp ? -1 : 0;
}
