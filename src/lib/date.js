// `new Date().toISOString().split('T')[0]` looks like a harmless way to get
// "today" as an ISO date string, but toISOString() converts to UTC first —
// during British Summer Time (UTC+1), anyone opening a form between
// midnight and ~1am local time gets YESTERDAY's date, because UTC hasn't
// ticked over to the new day yet. This builds the string from the local
// calendar fields instead, so it always matches the date on the user's own
// clock, matching what DatePicker's own internal "today" check already did.
export function getLocalISODate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
