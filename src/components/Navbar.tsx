import React from 'react';
import {
  GraduationCap,
  Plus,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenQuickImport: () => void;
  onResetData: () => void;
  totalPendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenQuickImport,
  onResetData,
  totalPendingCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center shadow-md shadow-indigo-100 flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
                  Student Deadline Companion
                </h1>
                {totalPendingCount > 0 && (
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    {totalPendingCount} pending
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate hidden sm:block">
                All your deadlines from WhatsApp, Classroom & notes in one place
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Quick paste / Smart parser button */}
            <button
              type="button"
              onClick={onOpenQuickImport}
              id="quick-import-btn"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200/70 rounded-lg transition-colors cursor-pointer"
              title="Paste announcement or WhatsApp message to auto-fill assignment"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Paste Announcement</span>
              <span className="sm:hidden">Paste</span>
            </button>

            {/* Primary Add Assignment button */}
            <button
              type="button"
              onClick={onOpenAddModal}
              id="add-assignment-btn"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm rounded-lg transition-all transform active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Assignment</span>
            </button>

            {/* Link to Standalone HTML/CSS/JS version */}
            <a
              href="/standalone/index.html"
              target="_blank"
              rel="noopener noreferrer"
              id="view-standalone-btn"
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              title="Open pure HTML/CSS/JS standalone version"
            >
              <span>📄 HTML/JS Mode</span>
            </a>

            {/* Reset sample data helper button */}
            <button
              type="button"
              onClick={onResetData}
              id="reset-data-btn"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Reset to sample student assignments"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
