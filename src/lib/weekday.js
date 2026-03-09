const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function getWeekday(dayNumber) {
  return DAYS[dayNumber] ?? ""
}
