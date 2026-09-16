import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  Clock,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ListTodo,
  Plus,
  Sparkles,
  Info,
} from 'lucide-react';
import { Assignment, FilterState, TabType, Priority } from './types';
import { getInitialAssignments } from './data/initialData';
import { categorizeAssignment, isDueThisWeek } from './utils/dateUtils';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { FilterBar } from './components/FilterBar';
import { AssignmentCard } from './components/AssignmentCard';
import { AssignmentGroup } from './components/AssignmentGroup';
import { AddEditAssignmentModal } from './components/AddEditAssignmentModal';
import { QuickImportModal } from './components/QuickImportModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { EmptyState } from './components/EmptyState';
import { SubjectOverviewBar } from './components/SubjectOverviewBar';

const STORAGE_KEY = 'student_deadline_companion_data_v1';

export default function App() {
  // 1. Core Data State with LocalStorage
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to parse saved assignments:', err);
    }
    return getInitialAssignments();
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    } catch (err) {
      console.error('Failed to save assignments:', err);
    }
  }, [assignments]);

  // 2. Filter & Navigation State
  const [filterState, setFilterState] = useState<FilterState>({
    tab: 'all',
    searchQuery: '',
    priority: 'all',
    subject: 'all',
    source: 'all',
    sortBy: 'dueDate-asc',
  });

  // 3. Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [deletingAssignment, setDeletingAssignment] = useState<Assignment | null>(null);
  const [isQuickImportOpen, setIsQuickImportOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Distinct subjects & sources for filter menus
  const distinctSubjects = useMemo(() => {
    const subs = Array.from(new Set(assignments.map((a) => a.subject))).filter(Boolean);
    return subs.sort();
  }, [assignments]);

  const distinctSources = useMemo(() => {
    const srcs = Array.from(new Set(assignments.map((a) => a.source))).filter(Boolean);
    return srcs.sort();
  }, [assignments]);

  // Tab counts
  const counts = useMemo(() => {
    let today = 0;
    let thisWeek = 0;
    let upcoming = 0;
    let overdue = 0;
    let completed = 0;

    assignments.forEach((a) => {
      if (a.completed) {
        completed++;
      } else {
        const cat = categorizeAssignment(a);
        if (cat === 'overdue') overdue++;
        else if (cat === 'today') today++;
        else upcoming++;

        if (isDueThisWeek(a)) {
          thisWeek++;
        }
      }
    });

    return {
      all: assignments.length,
      today,
      thisWeek,
      upcoming,
      overdue,
      completed,
    };
  }, [assignments]);

  // Handlers for Assignment operations
  const handleToggleComplete = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextCompleted = !a.completed;
          showToast(nextCompleted ? 'Assignment completed! Great job! 🎉' : 'Assignment marked as pending.');
          return {
            ...a,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return a;
      })
    );
  };

  const handleSaveAssignment = (
    assignmentData: Omit<Assignment, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      // Edit existing
      setAssignments((prev) =>
        prev.map((a) => (a.id === existingId ? { ...a, ...assignmentData } : a))
      );
      showToast('Assignment updated successfully.');
    } else {
      // Add new
      const newAssignment: Assignment = {
        ...assignmentData,
        id: `asg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setAssignments((prev) => [newAssignment, ...prev]);
      showToast('New assignment added!');
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingAssignment) return;
    setAssignments((prev) => prev.filter((a) => a.id !== deletingAssignment.id));
    showToast('Assignment deleted.');
    setDeletingAssignment(null);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all assignments back to sample college courses?')) {
      const fresh = getInitialAssignments();
      setAssignments(fresh);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      showToast('Sample assignments reloaded.');
    }
  };

  // Filter and Sort Logic
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      // Tab filter
      if (filterState.tab === 'completed') {
        if (!a.completed) return false;
      } else if (filterState.tab === 'today') {
        if (a.completed || categorizeAssignment(a) !== 'today') return false;
      } else if (filterState.tab === 'this-week') {
        if (a.completed || !isDueThisWeek(a)) return false;
      } else if (filterState.tab === 'upcoming') {
        if (a.completed || categorizeAssignment(a) !== 'upcoming') return false;
      } else if (filterState.tab === 'overdue') {
        if (a.completed || categorizeAssignment(a) !== 'overdue') return false;
      }

      // Priority filter
      if (filterState.priority !== 'all' && a.priority !== filterState.priority) {
        return false;
      }

      // Subject filter
      if (filterState.subject !== 'all' && a.subject !== filterState.subject) {
        return false;
      }

      // Source filter
      if (filterState.source !== 'all' && a.source !== filterState.source) {
        return false;
      }

      // Search Query
      if (filterState.searchQuery.trim()) {
        const query = filterState.searchQuery.toLowerCase().trim();
        const inTitle = a.title.toLowerCase().includes(query);
        const inSubject = a.subject.toLowerCase().includes(query);
        const inNotes = a.notes ? a.notes.toLowerCase().includes(query) : false;
        if (!inTitle && !inSubject && !inNotes) return false;
      }

      return true;
    });
  }, [assignments, filterState]);

  // Sort assignments
  const sortedAssignments = useMemo(() => {
    const list = [...filteredAssignments];

    const priorityWeight: Record<Priority, number> = {
      High: 3,
      Medium: 2,
      Low: 1,
    };

    list.sort((a, b) => {
      // Completed items always sink to bottom unless on completed tab
      if (filterState.tab !== 'completed' && a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      if (filterState.sortBy === 'dueDate-asc') {
        const dateDiff = a.dueDate.localeCompare(b.dueDate);
        if (dateDiff !== 0) return dateDiff;
        return (a.dueTime || '23:59').localeCompare(b.dueTime || '23:59');
      }

      if (filterState.sortBy === 'dueDate-desc') {
        const dateDiff = b.dueDate.localeCompare(a.dueDate);
        if (dateDiff !== 0) return dateDiff;
        return (b.dueTime || '23:59').localeCompare(a.dueTime || '23:59');
      }

      if (filterState.sortBy === 'priority') {
        const pDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
        if (pDiff !== 0) return pDiff;
        return a.dueDate.localeCompare(b.dueDate);
      }

      if (filterState.sortBy === 'subject') {
        return a.subject.localeCompare(b.subject);
      }

      if (filterState.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });

    return list;
  }, [filteredAssignments, filterState.sortBy, filterState.tab]);

  // Categorized breakdown when tab === 'all'
  const overdueList = useMemo(
    () => sortedAssignments.filter((a) => !a.completed && categorizeAssignment(a) === 'overdue'),
    [sortedAssignments]
  );
  const todayList = useMemo(
    () => sortedAssignments.filter((a) => !a.completed && categorizeAssignment(a) === 'today'),
    [sortedAssignments]
  );
  const thisWeekList = useMemo(
    () => sortedAssignments.filter((a) => !a.completed && categorizeAssignment(a) !== 'today' && isDueThisWeek(a)),
    [sortedAssignments]
  );
  const laterUpcomingList = useMemo(
    () => sortedAssignments.filter((a) => !a.completed && categorizeAssignment(a) === 'upcoming' && !isDueThisWeek(a)),
    [sortedAssignments]
  );
  const completedList = useMemo(
    () => sortedAssignments.filter((a) => a.completed),
    [sortedAssignments]
  );

  const hasActiveFilters =
    filterState.searchQuery !== '' ||
    filterState.priority !== 'all' ||
    filterState.subject !== 'all' ||
    filterState.source !== 'all';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white pb-16">
      {/* Toast message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        onOpenAddModal={() => {
          setEditingAssignment(null);
          setIsAddModalOpen(true);
        }}
        onOpenQuickImport={() => setIsQuickImportOpen(true)}
        onResetData={handleResetData}
        totalPendingCount={counts.today + counts.overdue + counts.upcoming}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 w-full flex-1 space-y-5 sm:space-y-6">
        {/* Overdue Urgent Alert Banner */}
        {counts.overdue > 0 && filterState.tab !== 'overdue' && (
          <div className="bg-rose-50 border border-rose-200/90 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-700 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-900">
                  Attention: You have {counts.overdue} overdue {counts.overdue === 1 ? 'assignment' : 'assignments'}!
                </h4>
                <p className="text-xs text-rose-700">
                  Review past due submissions to avoid late penalty deductions.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFilterState((prev) => ({ ...prev, tab: 'overdue' }))}
              className="self-start sm:self-center px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              View Overdue ({counts.overdue})
            </button>
          </div>
        )}

        {/* Top Stats Overview Cards */}
        <StatsCards
          totalCount={counts.all}
          todayCount={counts.today}
          thisWeekCount={counts.thisWeek}
          overdueCount={counts.overdue}
          completedCount={counts.completed}
          activeTab={filterState.tab}
          onSelectTab={(tab) => setFilterState((prev) => ({ ...prev, tab }))}
        />

        {/* Subject Workload Bar */}
        <SubjectOverviewBar
          assignments={assignments}
          selectedSubject={filterState.subject}
          onSelectSubject={(subject) => setFilterState((prev) => ({ ...prev, subject }))}
        />

        {/* Search, Tabs & Filter Bar */}
        <FilterBar
          filterState={filterState}
          onFilterChange={(updates) => setFilterState((prev) => ({ ...prev, ...updates }))}
          onResetFilters={() =>
            setFilterState({
              tab: 'all',
              searchQuery: '',
              priority: 'all',
              subject: 'all',
              source: 'all',
              sortBy: 'dueDate-asc',
            })
          }
          subjects={distinctSubjects}
          sources={distinctSources}
          counts={counts}
        />

        {/* Assignments Display Area */}
        {sortedAssignments.length === 0 ? (
          <EmptyState
            tab={filterState.tab}
            hasFilters={hasActiveFilters}
            onResetFilters={() =>
              setFilterState((prev) => ({
                ...prev,
                searchQuery: '',
                priority: 'all',
                subject: 'all',
                source: 'all',
              }))
            }
            onOpenAddModal={() => {
              setEditingAssignment(null);
              setIsAddModalOpen(true);
            }}
            onOpenQuickImport={() => setIsQuickImportOpen(true)}
          />
        ) : filterState.tab === 'all' && !hasActiveFilters ? (
          /* When viewing "All" with no specific search filter, present organized sections */
          <div className="space-y-6">
            {/* Overdue Section */}
            {overdueList.length > 0 && (
              <AssignmentGroup
                title="Overdue Assignments"
                count={overdueList.length}
                icon={AlertTriangle}
                iconColor="text-rose-600"
                badgeColor="bg-rose-100 text-rose-800"
                assignments={overdueList}
                onToggleComplete={handleToggleComplete}
                onEdit={(asg) => {
                  setEditingAssignment(asg);
                  setIsAddModalOpen(true);
                }}
                onDelete={(asg) => setDeletingAssignment(asg)}
              />
            )}

            {/* Today's Assignments */}
            {todayList.length > 0 && (
              <AssignmentGroup
                title="Today's Assignments"
                count={todayList.length}
                icon={Clock}
                iconColor="text-amber-600"
                badgeColor="bg-amber-100 text-amber-800"
                assignments={todayList}
                onToggleComplete={handleToggleComplete}
                onEdit={(asg) => {
                  setEditingAssignment(asg);
                  setIsAddModalOpen(true);
                }}
                onDelete={(asg) => setDeletingAssignment(asg)}
              />
            )}

            {/* Due This Week Section */}
            {thisWeekList.length > 0 && (
              <AssignmentGroup
                title="Due This Week (Next 7 Days)"
                count={thisWeekList.length}
                icon={CalendarDays}
                iconColor="text-blue-600"
                badgeColor="bg-blue-100 text-blue-800"
                assignments={thisWeekList}
                onToggleComplete={handleToggleComplete}
                onEdit={(asg) => {
                  setEditingAssignment(asg);
                  setIsAddModalOpen(true);
                }}
                onDelete={(asg) => setDeletingAssignment(asg)}
              />
            )}

            {/* Later Upcoming Assignments */}
            {laterUpcomingList.length > 0 && (
              <AssignmentGroup
                title="Later Upcoming Deadlines"
                count={laterUpcomingList.length}
                icon={Calendar}
                iconColor="text-indigo-600"
                badgeColor="bg-indigo-100 text-indigo-800"
                assignments={laterUpcomingList}
                onToggleComplete={handleToggleComplete}
                onEdit={(asg) => {
                  setEditingAssignment(asg);
                  setIsAddModalOpen(true);
                }}
                onDelete={(asg) => setDeletingAssignment(asg)}
              />
            )}

            {/* Completed Assignments */}
            {completedList.length > 0 && (
              <AssignmentGroup
                title="Completed Assignments"
                count={completedList.length}
                icon={CheckCircle2}
                iconColor="text-emerald-600"
                badgeColor="bg-emerald-100 text-emerald-800"
                assignments={completedList}
                onToggleComplete={handleToggleComplete}
                onEdit={(asg) => {
                  setEditingAssignment(asg);
                  setIsAddModalOpen(true);
                }}
                onDelete={(asg) => setDeletingAssignment(asg)}
              />
            )}
          </div>
        ) : (
          /* Filtered or single tab view */
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-slate-500">
                Showing {sortedAssignments.length}{' '}
                {sortedAssignments.length === 1 ? 'assignment' : 'assignments'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {sortedAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onToggleComplete={handleToggleComplete}
                  onEdit={(asg) => {
                    setEditingAssignment(asg);
                    setIsAddModalOpen(true);
                  }}
                  onDelete={(asg) => setDeletingAssignment(asg)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Assignment Modal */}
      <AddEditAssignmentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAssignment(null);
        }}
        onSave={handleSaveAssignment}
        initialData={editingAssignment}
        existingSubjects={distinctSubjects}
      />

      {/* Quick Import / WhatsApp Parser Modal */}
      <QuickImportModal
        isOpen={isQuickImportOpen}
        onClose={() => setIsQuickImportOpen(false)}
        onSave={(newAssignment) => {
          handleSaveAssignment(newAssignment);
          setIsQuickImportOpen(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        assignment={deletingAssignment}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingAssignment(null)}
      />
    </div>
  );
}
