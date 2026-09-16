import React from 'react';
import { BookOpen, CheckCircle2, AlertCircle, Plus, Sparkles } from 'lucide-react';
import { TabType } from '../types';

interface EmptyStateProps {
  tab: TabType;
  hasFilters: boolean;
  onResetFilters: () => void;
  onOpenAddModal: () => void;
  onOpenQuickImport: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  tab,
  hasFilters,
  onResetFilters,
  onOpenAddModal,
  onOpenQuickImport,
}) => {
  if (hasFilters) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No matching assignments</h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-4">
          We couldn't find any assignments matching your current search or filter criteria.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  if (tab === 'overdue') {
    return (
      <div className="bg-white rounded-2xl border border-emerald-200/80 bg-emerald-50/20 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No overdue assignments!</h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Awesome work! You don't have any past-due assignments pending submission.
        </p>
      </div>
    );
  }

  if (tab === 'today') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Nothing due today!</h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-4">
          Enjoy your free time or get a head start on upcoming deadlines.
        </p>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Assignment</span>
        </button>
      </div>
    );
  }

  if (tab === 'this-week') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No deadlines this week!</h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-4">
          You're completely clear for the next 7 days. Take a break or prepare for upcoming coursework.
        </p>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Assignment</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
        <BookOpen className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900">No assignments found</h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-5">
        Start tracking your coursework from WhatsApp messages, Classroom announcements, and notebooks.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Assignment</span>
        </button>
        <button
          type="button"
          onClick={onOpenQuickImport}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Paste Announcement</span>
        </button>
      </div>
    </div>
  );
};
