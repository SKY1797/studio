import type { FC } from 'react';
import { Sun, Sunset, Moon, Coffee, Briefcase, type LucideProps } from 'lucide-react';
import type { ShiftType } from '@/lib/shift-logic';

interface ShiftIconProps extends LucideProps {
  type: ShiftType;
}

export const ShiftIcon: FC<ShiftIconProps> = ({ type, ...props }) => {
  const icons: Record<ShiftType, FC<LucideProps>> = {
    MORNING: Sun,
    EVENING: Sunset,
    NIGHT: Moon,
    WEEKLY_OFF: Coffee,
    GENERAL: Briefcase,
  };

  const IconComponent = icons[type];
  if (!IconComponent) return null;

  return <IconComponent {...props} />;
};
