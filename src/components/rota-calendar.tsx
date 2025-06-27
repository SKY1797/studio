"use client";

import { useState, useMemo, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getShiftForDate, type Shift } from '@/lib/shift-logic';
import { ShiftIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const DayCard = ({ day, shift, isCurrentMonth, isTodayFlag }: { day: Date; shift: Shift; isCurrentMonth: boolean; isTodayFlag: boolean }) => {
    const isWeeklyOff = shift.type === 'WEEKLY_OFF';
    
    return (
        <div
            className={cn(
                'relative flex flex-col justify-between h-28 sm:h-32 rounded-lg p-2 border transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md',
                !isCurrentMonth && 'text-muted-foreground/70 bg-muted/50',
                isCurrentMonth && 'bg-card',
                isTodayFlag && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                isWeeklyOff && 'bg-accent/20 border-accent text-accent-foreground',
            )}
        >
            <div className={cn(
                'font-bold text-sm sm:text-base',
                isTodayFlag ? 'text-primary' : ''
            )}>
                {format(day, 'd')}
            </div>
            <div className="flex flex-col items-center text-center gap-1">
                <ShiftIcon type={shift.type} className={cn('w-5 h-5 sm:w-6 sm:h-6', isWeeklyOff ? 'text-accent-foreground' : 'text-primary')} />
                <span className={cn(
                    'text-[10px] sm:text-xs font-medium',
                     isWeeklyOff ? 'text-accent-foreground' : 'text-muted-foreground'
                )}>{shift.name}</span>
            </div>
        </div>
    );
};

const CalendarSkeleton = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <Skeleton className="h-8 w-48 rounded-md" />
            <div className="flex gap-2">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
            </div>
        </CardHeader>
        <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-muted-foreground mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day}>{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {[...Array(35)].map((_, i) => (
                    <Skeleton key={i} className="h-28 sm:h-32 rounded-lg" />
                ))}
            </div>
        </CardContent>
    </Card>
);

export default function RotaCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const calendarDays = useMemo(() => {
    if (!isClient) return [];
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    return eachDayOfInterval({
      start: startOfWeek(firstDayOfMonth),
      end: endOfWeek(lastDayOfMonth),
    });
  }, [currentDate, isClient]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!isClient) {
      return <CalendarSkeleton />;
  }

  return (
    <Card className="shadow-lg animate-in fade-in-50 duration-500">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold font-headline text-primary">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth} aria-label="Previous month">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} aria-label="Next month">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm font-semibold text-muted-foreground mb-2">
          {weekDays.map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map(day => {
            const shift = getShiftForDate(day);
            return (
              <DayCard
                key={day.toString()}
                day={day}
                shift={shift}
                isCurrentMonth={isSameMonth(day, currentDate)}
                isTodayFlag={isToday(day)}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
