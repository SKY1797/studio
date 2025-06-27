import { differenceInCalendarDays, getDay } from 'date-fns';

export type ShiftType = 'MORNING' | 'EVENING' | 'NIGHT' | 'WEEKLY_OFF' | 'GENERAL';

export interface Shift {
  name: string;
  type: ShiftType;
}

// The 8-day repeating shift cycle as per the user request
export const SHIFT_CYCLE: readonly Shift[] = [
  { name: 'Evening Shift', type: 'EVENING' },
  { name: 'Evening Shift', type: 'EVENING' },
  { name: 'Night Shift', type: 'NIGHT' },
  { name: 'Night Shift', type: 'NIGHT' },
  { name: 'Weekly Off', type: 'WEEKLY_OFF' },
  { name: 'General Shift', type: 'GENERAL' },
  { name: 'Morning Shift', type: 'MORNING' },
  { name: 'Morning Shift', type: 'MORNING' },
] as const;

// A fixed reference date to ensure the rota is consistent and predictable.
// Let's assume 2025-06-27 was an 'Evening Shift' (index 0 of our cycle).
const REFERENCE_DATE = new Date('2025-06-27T00:00:00Z');
const REFERENCE_SHIFT_INDEX = 0; 

export function getShiftForDate(date: Date): Shift {
  const daysDifference = differenceInCalendarDays(date, REFERENCE_DATE);
  
  // Calculate the index in the cycle, ensuring it's always a positive number
  const cycleIndex = (REFERENCE_SHIFT_INDEX + daysDifference) % SHIFT_CYCLE.length;
  const positiveCycleIndex = (cycleIndex + SHIFT_CYCLE.length) % SHIFT_CYCLE.length;

  let calculatedShift = SHIFT_CYCLE[positiveCycleIndex];

  // Special rule: If a General Shift falls on a Sunday (date-fns getDay() returns 0 for Sunday),
  // it is replaced with a Weekly Off.
  if (calculatedShift.type === 'GENERAL' && getDay(date) === 0) {
    return { name: 'Weekly Off', type: 'WEEKLY_OFF' };
  }

  return calculatedShift;
}
