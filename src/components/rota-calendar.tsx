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
import { getShiftForDate, type Shift, type Group, ShiftType } from '@/lib/shift-logic';
import { ShiftIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DayCard = ({ day, shift, isCurrentMonth, isTodayFlag }: { day: Date; shift: Shift; isCurrentMonth: boolean; isTodayFlag: boolean }) => {
    const shiftStyles: Record<ShiftType, { bg: string, text: string, icon: string, name: string }> = {
        MORNING:    { bg: 'bg-shift-morning',    text: 'text-foreground',         icon: 'text-primary', name: 'text-muted-foreground' },
        EVENING:    { bg: 'bg-shift-evening',    text: 'text-foreground',         icon: 'text-primary', name: 'text-muted-foreground' },
        NIGHT:      { bg: 'bg-shift-night',      text: 'text-primary-foreground', icon: 'text-primary-foreground', name: 'text-primary-foreground/80' },
        WEEKLY_OFF: { bg: 'bg-shift-weekly-off', text: 'text-primary-foreground', icon: 'text-primary-foreground', name: 'text-primary-foreground/80' },
        GENERAL:    { bg: 'bg-shift-general',    text: 'text-foreground',         icon: 'text-primary', name: 'text-muted-foreground' },
    };
    
    const styles = shiftStyles[shift.type];
    
    return (
        <div
            className={cn(
                'relative flex flex-col justify-between h-28 sm:h-32 rounded-lg p-2 border transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md',
                !isCurrentMonth ? 'text-muted-foreground/70 bg-muted/50' : styles.bg,
                isTodayFlag && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
            )}
        >
            <div className={cn(
                'font-bold text-sm sm:text-base',
                isTodayFlag ? 'text-primary' : (isCurrentMonth ? styles.text : '')
            )}>
                {format(day, 'd')}
            </div>
            <div className="flex flex-col items-center text-center gap-1">
                <ShiftIcon type={shift.type} className={cn('w-5 h-5 sm:w-6 sm:h-6', isCurrentMonth ? styles.icon : 'text-primary')} />
                <span className={cn(
                    'text-[10px] sm:text-xs font-medium',
                    isCurrentMonth ? styles.name : 'text-muted-foreground'
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
  const [selectedGroup, setSelectedGroup] = useState<Group>('A');
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
    <div className="flex flex-col gap-4">
      <Tabs value={selectedGroup} onValueChange={(value) => setSelectedGroup(value as Group)} className="w-full max-w-sm mx-auto">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="A" className="text-xs sm:text-sm">Group A</TabsTrigger>
          <TabsTrigger value="B" className="text-xs sm:text-sm">Group B</TabsTrigger>
          <TabsTrigger value="C" className="text-xs sm:text-sm">Group C</TabsTrigger>
          <TabsTrigger value="D" className="text-xs sm:text-sm">Group D</TabsTrigger>
        </TabsList>
      </Tabs>
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
              const shift = getShiftForDate(day, selectedGroup);
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
    </div>
  );
}
