import { Assignment } from '../types';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getOffsetDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export type DeadlineCategory = 'overdue' | 'today' | 'upcoming' | 'completed';

export function isDueThisWeek(assignment: Assignment): boolean {
  if (assignment.completed) return false;
  const category = categorizeAssignment(assignment);
  if (category === 'overdue') return false;

  const todayStr = getTodayDateString();
  const next7DaysStr = getOffsetDateString(7);
  return assignment.dueDate >= todayStr && assignment.dueDate <= next7DaysStr;
}

export function categorizeAssignment(assignment: Assignment): DeadlineCategory {
  if (assignment.completed) {
    return 'completed';
  }

  const todayStr = getTodayDateString();
  const now = new Date();

  // If due date is strictly before today's calendar date
  if (assignment.dueDate < todayStr) {
    return 'overdue';
  }

  // If due date is today, check if due time has passed
  if (assignment.dueDate === todayStr) {
    if (assignment.dueTime) {
      const [hours, minutes] = assignment.dueTime.split(':').map(Number);
      const dueDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      if (now.getTime() > dueDateTime.getTime()) {
        return 'overdue';
      }
    }
    return 'today';
  }

  // Otherwise, future date
  return 'upcoming';
}

export function formatHumanDate(dateStr: string, timeStr?: string): string {
  if (!dateStr) return '';

  const todayStr = getTodayDateString();
  const tomorrowStr = getOffsetDateString(1);
  const yesterdayStr = getOffsetDateString(-1);

  // Time format (e.g. 11:59 PM)
  let formattedTime = '';
  if (timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const displayMin = String(m).padStart(2, '0');
    formattedTime = `${displayHour}:${displayMin} ${period}`;
  }

  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  if (dateStr === todayStr) {
    return formattedTime ? `Today at ${formattedTime}` : 'Today';
  } else if (dateStr === tomorrowStr) {
    return formattedTime ? `Tomorrow at ${formattedTime}` : 'Tomorrow';
  } else if (dateStr === yesterdayStr) {
    return formattedTime ? `Yesterday at ${formattedTime}` : 'Yesterday';
  }

  const formattedDate = `${monthNames[targetDate.getMonth()]} ${targetDate.getDate()}, ${targetDate.getFullYear()}`;
  return formattedTime ? `${formattedDate} • ${formattedTime}` : formattedDate;
}

export function getRelativeTimeBadge(assignment: Assignment): {
  text: string;
  isOverdue: boolean;
  isToday: boolean;
  isSoon: boolean;
} {
  if (assignment.completed) {
    return { text: 'Completed', isOverdue: false, isToday: false, isSoon: false };
  }

  const category = categorizeAssignment(assignment);
  const todayStr = getTodayDateString();

  if (category === 'overdue') {
    if (assignment.dueDate === todayStr) {
      return { text: 'Overdue (past due time)', isOverdue: true, isToday: true, isSoon: false };
    }
    const [y1, m1, d1] = todayStr.split('-').map(Number);
    const [y2, m2, d2] = assignment.dueDate.split('-').map(Number);
    const diffMs = new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
    const daysOverdue = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
    return {
      text: daysOverdue === 1 ? 'Overdue by 1 day' : `Overdue by ${daysOverdue} days`,
      isOverdue: true,
      isToday: false,
      isSoon: false,
    };
  }

  if (category === 'today') {
    return {
      text: assignment.dueTime ? `Due today by ${assignment.dueTime}` : 'Due today',
      isOverdue: false,
      isToday: true,
      isSoon: true,
    };
  }

  // Upcoming
  const [y1, m1, d1] = todayStr.split('-').map(Number);
  const [y2, m2, d2] = assignment.dueDate.split('-').map(Number);
  const targetDate = new Date(y2, m2 - 1, d2);
  const weekday = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
  const diffMs = targetDate.getTime() - new Date(y1, m1 - 1, d1).getTime();
  const daysLeft = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft === 1) {
    return { text: `Due tomorrow (${weekday})`, isOverdue: false, isToday: false, isSoon: true };
  }
  if (daysLeft <= 7) {
    return {
      text: `Due in ${daysLeft} days (${weekday})`,
      isOverdue: false,
      isToday: false,
      isSoon: daysLeft <= 3,
    };
  }
  return {
    text: `Due in ${daysLeft} days`,
    isOverdue: false,
    isToday: false,
    isSoon: false,
  };
}
