import moment from "moment/min/moment-with-locales";
moment.locale("vi");
export default function displayPastTimeFromNow(
  time: Date,
  customFormat?: string
) {
  const checkDisplayDateTime =
    moment(new Date()).unix() - moment(time).unix() < 172800;

  return checkDisplayDateTime
    ? moment(time).calendar()
    : moment(time).format(customFormat || "DD-MM-YYYY HH:mm");
}
