import React from 'react';
import {
  Calendar,
  CalendarDays,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ListTodo,
} from 'lucide-react';
import { TabType } from '../types';

interface StatsCardsProps {
  totalCount: number;
  todayCount: number;
  thisWeekCount: number;
  overdueCount: number;
  completedCount: number;
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalCount,
  todayCount,
  thisWeekCount,
  overdueCount,
  completedCount,
  activeTab,
  onSelectTab,
}) => {
  const pendingCount = Math.max(0, totalCount - completedCount);

  const cards = [
    {
      id: 'stat-all',
      tab: 'all' as TabType,
      title: 'Total Assignments',
      count: totalCount,
      label: `${pendingCount} pending to do`,
      icon: ListTodo,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-200',
      activeRing: 'ring-2 ring-slate-700 bg-slate-50/80 border-slate-400',
    },
    {
      id: 'stat-today',
      tab: 'today' as TabType,
      title: 'Due Today',
      count: todayCount,
      label: todayCount === 1 ? '1 assignment today' : `${todayCount} assignments today`,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      activeRing: 'ring-2 ring-amber-500 bg-amber-50/80 border-amber-300',
      badgeClass: todayCount > 0 ? 'bg-amber-500 text-white' : undefined,
    },
    {
      id: 'stat-this-week',
      tab: 'this-week' as TabType,
      title: 'Due This Week',
      count: thisWeekCount,
      label: 'Next 7 days window',
      icon: CalendarDays,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      activeRing: 'ring-2 ring-indigo-500 bg-indigo-50/80 border-indigo-300',
      badgeClass: thisWeekCount > 0 ? 'bg-indigo-600 text-white' : undefined,
    },
    {
      id: 'stat-overdue',
      tab: 'overdue' as TabType,
      title: 'Overdue',
      count: overdueCount,
      label: overdueCount > 0 ? 'Needs urgent action' : 'No past-due work',
      icon: AlertTriangle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      activeRing: 'ring-2 ring-rose-500 bg-rose-50/80 border-rose-300',
      badgeClass: overdueCount > 0 ? 'bg-rose-600 text-white animate-pulse' : undefined,
    },
    {
      id: 'stat-completed',
      tab: 'completed' as TabType,
      title: 'Completed',
      count: completedCount,
      label: `${Math.round((completedCount / (totalCount || 1)) * 100)}% finished`,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      activeRing: 'ring-2 ring-emerald-500 bg-emerald-50/80 border-emerald-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeTab === card.tab;

        return (
          <button
            key={card.id}
            id={card.id}
            type="button"
            onClick={() => onSelectTab(card.tab)}
            className={`text-left p-3.5 rounded-xl border bg-white transition-all shadow-xs hover:shadow-sm cursor-pointer relative overflow-hidden ${
              isActive
                ? card.activeRing
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
            }`}
          >
            <div className="flex items-center justify-between gap-1.5 mb-1.5">
              <span className="text-xs font-semibold text-slate-700 tracking-tight truncate">
                {card.title}
              </span>
              <div
                className={`w-7 h-7 rounded-lg ${card.bgColor} ${card.color} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.count}
              </span>
              {card.badgeClass && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${card.badgeClass}`}>
                  Active
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mt-1 truncate">
              {card.label}
            </p>
          </button>
        );
      })}
    </div>
  );
};
