import moment from "moment/min/moment-with-locales";
moment.locale("vi");
export default function displayPastTimeFromNow(
  time: Date,
  customFormat?: string,
  onlyDigits?: boolean
) {
  if (onlyDigits) {
    const checkDisplayDateTime =
      new Date(time).toLocaleDateString() === new Date().toLocaleDateString();

    return checkDisplayDateTime
      ? moment(time).format(customFormat || "HH:mm")
      : moment(time).format(customFormat || "DD-MM-YYYY HH:mm");
  } else {
    const checkDisplayDateTime =
      moment(new Date()).unix() - moment(time).unix() < 172800;

    return checkDisplayDateTime
      ? moment(time).calendar()
      : moment(time).format(customFormat || "DD-MM-YYYY HH:mm");
  }
}
