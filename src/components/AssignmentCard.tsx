import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  MoreVertical,
  Edit2,
  Trash2,
  MessageSquare,
  Building2,
  BookOpen,
  Mail,
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Assignment, AssignmentSource, Priority } from '../types';
import { formatHumanDate, getRelativeTimeBadge } from '../utils/dateUtils';

interface AssignmentCardProps {
  assignment: Assignment;
  onToggleComplete: (id: string) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const relativeBadge = getRelativeTimeBadge(assignment);

  // Priority color styling
  const priorityStyles: Record<Priority, { label: string; badge: string; dot: string; border: string }> = {
    High: {
      label: 'High Priority',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      border: 'border-l-rose-500',
    },
    Medium: {
      label: 'Medium Priority',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      border: 'border-l-amber-500',
    },
    Low: {
      label: 'Low Priority',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      border: 'border-l-emerald-500',
    },
  };

  // Source icon helper
  const getSourceIcon = (source: AssignmentSource) => {
    switch (source) {
      case 'WhatsApp':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Google Classroom':
        return <Building2 className="w-3.5 h-3.5 text-amber-600" />;
      case 'Moodle / LMS':
        return <Building2 className="w-3.5 h-3.5 text-orange-600" />;
      case 'Notebook / Lecture':
        return <BookOpen className="w-3.5 h-3.5 text-blue-600" />;
      case 'Email':
        return <Mail className="w-3.5 h-3.5 text-sky-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div
      id={`assignment-card-${assignment.id}`}
      className={`group relative bg-white rounded-xl border transition-all hover:shadow-md ${
        assignment.completed
          ? 'border-slate-200 bg-slate-50/50 opacity-75'
          : relativeBadge.isOverdue
          ? 'border-rose-300 shadow-xs bg-white'
          : 'border-slate-200 shadow-xs'
      } border-l-4 ${priorityStyles[assignment.priority].border}`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Completion Checkbox */}
          <button
            type="button"
            onClick={() => onToggleComplete(assignment.id)}
            id={`toggle-complete-${assignment.id}`}
            className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            title={assignment.completed ? 'Mark as pending' : 'Mark as completed'}
          >
            {assignment.completed ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100 transition-transform active:scale-90" />
            ) : (
              <Circle className="w-6 h-6 text-slate-400 hover:text-indigo-600 transition-transform active:scale-90" />
            )}
          </button>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Top row: Subject & Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
              {/* Subject Badge */}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-100">
                {assignment.subject}
              </span>

              {/* Priority Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
                  priorityStyles[assignment.priority].badge
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    priorityStyles[assignment.priority].dot
                  }`}
                />
                {assignment.priority}
              </span>

              {/* Source Tag */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                {getSourceIcon(assignment.source)}
                <span className="hidden sm:inline">{assignment.source}</span>
                <span className="sm:hidden">{assignment.source.split(' ')[0]}</span>
              </span>

              {/* Submission type badge */}
              {assignment.submissionType && (
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-xs text-slate-500 bg-slate-50 border border-slate-200/60">
                  {assignment.submissionType}
                </span>
              )}
            </div>

            {/* Assignment Title */}
            <h3
              className={`text-base sm:text-lg font-bold leading-snug tracking-tight text-slate-900 ${
                assignment.completed ? 'line-through text-slate-500 font-normal' : ''
              }`}
            >
              {assignment.title}
            </h3>

            {/* Due Date & Deadline Info */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
              {/* Formatted Date */}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatHumanDate(assignment.dueDate, assignment.dueTime)}</span>
              </div>

              {/* Status / Relative Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  assignment.completed
                    ? 'bg-emerald-100 text-emerald-800'
                    : relativeBadge.isOverdue
                    ? 'bg-rose-100 text-rose-800 font-bold animate-pulse'
                    : relativeBadge.isToday
                    ? 'bg-amber-100 text-amber-800 font-bold'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {relativeBadge.isOverdue && <AlertCircle className="w-3 h-3 text-rose-600" />}
                {relativeBadge.isToday && !relativeBadge.isOverdue && (
                  <Clock className="w-3 h-3 text-amber-600" />
                )}
                {relativeBadge.text}
              </span>

              {/* Estimated Hours */}
              {assignment.estimatedHours && !assignment.completed && (
                <span className="text-slate-500 hidden sm:inline-flex items-center gap-1">
                  <span>•</span>
                  <span>Est. {assignment.estimatedHours}h effort</span>
                </span>
              )}
            </div>

            {/* Notes Section if available */}
            {assignment.notes && (
              <div className="mt-3 text-xs">
                {showNotes ? (
                  <div className="p-2.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200/70 whitespace-pre-line leading-relaxed">
                    {assignment.notes}
                  </div>
                ) : (
                  <p className="text-slate-500 line-clamp-1 italic">
                    "{assignment.notes}"
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setShowNotes(!showNotes)}
                  className="mt-1 inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                >
                  {showNotes ? (
                    <>
                      <span>Hide details</span>
                      <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <span>View details</span>
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Action buttons (Desktop hover & Mobile dropdown) */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Direct Edit Button */}
            <button
              type="button"
              onClick={() => onEdit(assignment)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Edit assignment"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            {/* Direct Delete Button */}
            <button
              type="button"
              onClick={() => onDelete(assignment)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete assignment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
