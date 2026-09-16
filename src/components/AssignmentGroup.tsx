import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Assignment } from '../types';
import { AssignmentCard } from './AssignmentCard';

interface AssignmentGroupProps {
  title: string;
  count: number;
  icon: LucideIcon;
  iconColor: string;
  badgeColor: string;
  assignments: Assignment[];
  onToggleComplete: (id: string) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
  emptyMessage?: string;
  collapsible?: boolean;
}

export const AssignmentGroup: React.FC<AssignmentGroupProps> = ({
  title,
  count,
  icon: Icon,
  iconColor,
  badgeColor,
  assignments,
  onToggleComplete,
  onEdit,
  onDelete,
  emptyMessage = 'No assignments in this section',
}) => {
  if (assignments.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${iconColor} bg-white shadow-2xs border border-slate-200/80`}>
            <Icon className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}>
            {count}
          </span>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 gap-3">
        {assignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
};
