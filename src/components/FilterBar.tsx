import React from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { FilterState, TabType, Priority, SortOption } from '../types';

interface FilterBarProps {
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  subjects: string[];
  sources: string[];
  counts: {
    all: number;
    today: number;
    thisWeek: number;
    upcoming: number;
    overdue: number;
    completed: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  onFilterChange,
  onResetFilters,
  subjects,
  sources,
  counts,
}) => {
  const tabs: { id: TabType; label: string; count: number; badgeColor?: string }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'today', label: 'Today', count: counts.today, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'this-week', label: 'This Week', count: counts.thisWeek, badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'upcoming', label: 'Upcoming', count: counts.upcoming, badgeColor: 'bg-indigo-100 text-indigo-800' },
    { id: 'overdue', label: 'Overdue', count: counts.overdue, badgeColor: counts.overdue > 0 ? 'bg-rose-100 text-rose-800 font-bold' : undefined },
    { id: 'completed', label: 'Completed', count: counts.completed, badgeColor: 'bg-emerald-100 text-emerald-800' },
  ];

  const hasActiveFilters =
    filterState.searchQuery !== '' ||
    filterState.priority !== 'all' ||
    filterState.subject !== 'all' ||
    filterState.source !== 'all';

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3 sm:p-4 space-y-3.5">
      {/* Top row: Tab Switcher & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = filterState.tab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                type="button"
                onClick={() => onFilterChange({ tab: tab.id })}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-xs ${
                    isActive
                      ? 'bg-slate-800 text-slate-100'
                      : tab.badgeColor || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            id="search-input"
            value={filterState.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search title, subject, notes..."
            className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-colors"
          />
          {filterState.searchQuery && (
            <button
              type="button"
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs sm:text-sm">
        <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Subject Filter */}
        <select
          id="filter-subject"
          value={filterState.subject}
          onChange={(e) => onFilterChange({ subject: e.target.value })}
          className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
        >
          <option value="all">All Subjects</option>
          {subjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          id="filter-priority"
          value={filterState.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value as 'all' | Priority })}
          className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="High">🔴 High Priority</option>
          <option value="Medium">🟠 Medium Priority</option>
          <option value="Low">🟢 Low Priority</option>
        </select>

        {/* Source Filter (WhatsApp, Classroom, etc.) */}
        <select
          id="filter-source"
          value={filterState.source}
          onChange={(e) => onFilterChange({ source: e.target.value })}
          className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
        >
          <option value="all">All Sources</option>
          {sources.map((src) => (
            <option key={src} value={src}>
              Source: {src}
            </option>
          ))}
        </select>

        {/* Sort by */}
        <div className="ml-auto flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          <select
            id="sort-by"
            value={filterState.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
            className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="dueDate-asc">Due Date (Soonest first)</option>
            <option value="dueDate-desc">Due Date (Latest first)</option>
            <option value="priority">Priority (High to Low)</option>
            <option value="subject">Subject Name</option>
            <option value="title">Assignment Title</option>
          </select>

          {/* Reset Filters button if applied */}
          {hasActiveFilters && (
            <button
              type="button"
              id="clear-filters-btn"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
