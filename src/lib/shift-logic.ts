import { differenceInCalendarDays, getDay } from 'date-fns';

export type ShiftType = 'MORNING' | 'EVENING' | 'NIGHT' | 'WEEKLY_OFF' | 'GENERAL';
export type Group = 'A' | 'B' | 'C' | 'D';

export interface Shift {
  name: string;
  type: ShiftType;
}

// The 8-day repeating shift cycle
export const SHIFT_CYCLE: readonly Shift[] = [
  { name: 'Evening Shift', type: 'EVENING' }, // 0
  { name: 'Evening Shift', type: 'EVENING' }, // 1
  { name: 'Night Shift', type: 'NIGHT' },     // 2
  { name: 'Night Shift', type: 'NIGHT' },     // 3
  { name: 'Weekly Off', type: 'WEEKLY_OFF' }, // 4
  { name: 'General Shift', type: 'GENERAL' },  // 5
  { name: 'Morning Shift', type: 'MORNING' }, // 6
  { name: 'Morning Shift', type: 'MORNING' }, // 7
] as const;

// A fixed reference date to ensure the rota is consistent and predictable.
const REFERENCE_DATE = new Date('2025-06-27T00:00:00Z');

// Reference shift indices for each group on the REFERENCE_DATE
const REFERENCE_SHIFT_INDICES: Record<Group, number> = {
  A: 2, // Group A starts with Night Shift
  B: 4, // Group B starts with Weekly Off
  C: 6, // Group C starts with Morning Shift
  D: 0, // Group D starts with Evening Shift
};

export function getShiftForDate(date: Date, group: Group): Shift {
  const daysDifference = differenceInCalendarDays(date, REFERENCE_DATE);
  
  const referenceShiftIndex = REFERENCE_SHIFT_INDICES[group];

  // Calculate the index in the cycle, ensuring it's always a positive number
  const cycleIndex = (referenceShiftIndex + daysDifference) % SHIFT_CYCLE.length;
  const positiveCycleIndex = (cycleIndex + SHIFT_CYCLE.length) % SHIFT_CYCLE.length;

  let calculatedShift = SHIFT_CYCLE[positiveCycleIndex];

  // Special rule: If a General Shift falls on a Sunday (date-fns getDay() returns 0 for Sunday),
  // it is replaced with a Weekly Off.
  if (calculatedShift.type === 'GENERAL' && getDay(date) === 0) {
    return { name: 'Weekly Off', type: 'WEEKLY_OFF' };
  }

  return calculatedShift;
}
