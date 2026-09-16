import React from 'react';
import { BookOpen, Layers } from 'lucide-react';
import { Assignment } from '../types';

interface SubjectOverviewBarProps {
  assignments: Assignment[];
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
}

export const SubjectOverviewBar: React.FC<SubjectOverviewBarProps> = ({
  assignments,
  selectedSubject,
  onSelectSubject,
}) => {
  // Count pending assignments per subject
  const pendingAssignments = assignments.filter((a) => !a.completed);

  const subjectCounts: Record<string, { total: number; highPriority: number }> = {};

  pendingAssignments.forEach((a) => {
    if (!subjectCounts[a.subject]) {
      subjectCounts[a.subject] = { total: 0, highPriority: 0 };
    }
    subjectCounts[a.subject].total += 1;
    if (a.priority === 'High') {
      subjectCounts[a.subject].highPriority += 1;
    }
  });

  const subjectList = Object.entries(subjectCounts).sort((a, b) => b[1].total - a[1].total);

  if (subjectList.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span>Active Subjects Workload:</span>
        </div>
        {selectedSubject !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectSubject('all')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
          >
            Show All
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {subjectList.map(([subject, stats]) => {
          const isSelected = selectedSubject === subject;
          return (
            <button
              key={subject}
              type="button"
              onClick={() => onSelectSubject(isSelected ? 'all' : subject)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span>{subject}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-xs ${
                  isSelected
                    ? 'bg-indigo-700 text-white'
                    : stats.highPriority > 0
                    ? 'bg-rose-100 text-rose-700 font-bold'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {stats.total}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
