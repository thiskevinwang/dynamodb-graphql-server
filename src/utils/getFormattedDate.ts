/**
 * YYYYMMDD-HHMMSS
 */
export const getFormattedDate = (d = new Date()) => {
  const year = d.getFullYear().toString()
  let month = (d.getMonth() + 1).toString()
  let day = d.getDate().toString()

  let hour = d.getHours().toString()
  let minute = d.getMinutes().toString()
  let second = d.getSeconds().toString()

  if (month.length < 2) month = "0" + month
  if (day.length < 2) day = "0" + day
  if (hour.length < 2) hour = "0" + hour
  if (minute.length < 2) minute = "0" + minute
  if (second.length < 2) second = "0" + second

  return [year, month, day].join("") + "-" + [hour, minute, second].join("")
}
