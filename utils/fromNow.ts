import moment from "moment";

export const getRelativeTime = (timestamp: any) => {
  const timeString = moment(Math.round(timestamp)).fromNow();
  return `About ${timeString}`;
};
