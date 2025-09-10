
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, addDays } from "date-fns"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getFridays() {
  const fridays = [];
  const today = new Date();
  let currentDay = today.getDay();
  let firstFriday = today;

  // Find the next Friday
  if (currentDay !== 5) {
      const daysToAdd = (5 - currentDay + 7) % 7;
      firstFriday = addDays(today, daysToAdd === 0 ? 7 : daysToAdd);
  }


  for (let i = 0; i < 8; i++) {
    const nextFriday = addDays(firstFriday, i * 7);
    fridays.push({
      value: nextFriday.toISOString(),
      label: format(nextFriday, "EEEE, MMMM do"),
    });
  }
  return fridays;
}
