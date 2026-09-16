import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  BookOpen,
  Tag,
  AlertCircle,
  Share2,
  FileCheck,
} from 'lucide-react';
import { Assignment, AssignmentSource, Priority, SubmissionType } from '../types';
import { COMMON_SUBJECTS, SOURCE_OPTIONS, SUBMISSION_OPTIONS } from '../data/initialData';
import { getTodayDateString, getOffsetDateString } from '../utils/dateUtils';

interface AddEditAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignmentData: Omit<Assignment, 'id' | 'createdAt'>, existingId?: string) => void;
  initialData?: Assignment | null;
  existingSubjects: string[];
}

export const AddEditAssignmentModal: React.FC<AddEditAssignmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingSubjects,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('23:59');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [source, setSource] = useState<AssignmentSource>('WhatsApp');
  const [submissionType, setSubmissionType] = useState<SubmissionType>('Online Portal');
  const [notes, setNotes] = useState('');
  const [estimatedHours, setEstimatedHours] = useState<string>('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSubject(initialData.subject);
      setDueDate(initialData.dueDate);
      setDueTime(initialData.dueTime || '23:59');
      setPriority(initialData.priority);
      setSource(initialData.source);
      setSubmissionType(initialData.submissionType || 'Online Portal');
      setNotes(initialData.notes || '');
      setEstimatedHours(initialData.estimatedHours ? String(initialData.estimatedHours) : '');
      setCompleted(initialData.completed);
    } else {
      setTitle('');
      setSubject('');
      setDueDate(getTodayDateString());
      setDueTime('23:59');
      setPriority('Medium');
      setSource('WhatsApp');
      setSubmissionType('Online Portal');
      setNotes('');
      setEstimatedHours('');
      setCompleted(false);
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter an assignment title');
      return;
    }
    if (!subject.trim()) {
      setError('Please select or enter a subject name');
      return;
    }
    if (!dueDate) {
      setError('Please pick a due date');
      return;
    }

    onSave(
      {
        title: title.trim(),
        subject: subject.trim(),
        dueDate,
        dueTime: dueTime || '23:59',
        priority,
        source,
        submissionType,
        notes: notes.trim() || undefined,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
        completed,
      },
      initialData ? initialData.id : undefined
    );
    onClose();
  };

  // Combine common subjects and user existing subjects
  const allSubjectSuggestions = Array.from(
    new Set([...existingSubjects, ...COMMON_SUBJECTS])
  ).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {initialData ? 'Edit Assignment' : 'Add New Assignment'}
            </h2>
            <p className="text-xs text-slate-500">
              Track deadlines from class groups, announcements, or lectures
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
              Assignment Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="assignment-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lab Report 4: Semaphore Implementation"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              autoFocus
              required
            />
          </div>

          {/* Subject with Quick Chips */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs sm:text-sm font-semibold text-slate-800">
                Subject Name <span className="text-rose-500">*</span>
              </label>
            </div>
            <input
              type="text"
              id="assignment-subject-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Data Structures & Algorithms"
              list="subject-suggestions"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              required
            />
            <datalist id="subject-suggestions">
              {allSubjectSuggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>

            {/* Quick chips */}
            <div className="mt-2 flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-slate-400">Suggestions:</span>
              {allSubjectSuggestions.slice(0, 4).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={`text-xs px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    subject === s
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Due Date</span> <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                id="assignment-due-date-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                required
              />
              <div className="mt-1.5 flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setDueDate(getTodayDateString())}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    dueDate === getTodayDateString()
                      ? 'bg-amber-100 text-amber-800 border-amber-300 font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setDueDate(getOffsetDateString(1))}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    dueDate === getOffsetDateString(1)
                      ? 'bg-amber-100 text-amber-800 border-amber-300 font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setDueDate(getOffsetDateString(3))}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    dueDate === getOffsetDateString(3)
                      ? 'bg-indigo-100 text-indigo-800 border-indigo-300 font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  In 3 Days
                </button>
                <button
                  type="button"
                  onClick={() => setDueDate(getOffsetDateString(7))}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    dueDate === getOffsetDateString(7)
                      ? 'bg-indigo-100 text-indigo-800 border-indigo-300 font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Next Week
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Due Time (Optional)</span>
              </label>
              <input
                type="time"
                id="assignment-due-time-input"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              />
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as Priority[]).map((p) => {
                const isSelected = priority === p;
                const colors = {
                  Low: isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50',
                  Medium: isSelected
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50',
                  High: isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300 hover:bg-rose-50/50',
                };

                return (
                  <button
                    key={p}
                    type="button"
                    id={`priority-btn-${p}`}
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl border transition-all text-center cursor-pointer ${colors[p]}`}
                  >
                    {p === 'High' && '🔴 High'}
                    {p === 'Medium' && '🟠 Medium'}
                    {p === 'Low' && '🟢 Low'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source & Submission Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Source Channel</span>
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as AssignmentSource)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 bg-white"
              >
                {SOURCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-slate-500" />
                <span>Submission Mode</span>
              </label>
              <select
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value as SubmissionType)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 bg-white"
              >
                {SUBMISSION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes / Instructions & Estimated Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                Notes & Instructions (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Upload PDF to Moodle. Don't forget citation page."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                Est. Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="100"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="e.g. 3"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              />
            </div>
          </div>

          {/* Completion toggle if editing */}
          {initialData && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">Completion Status</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="ml-2 text-xs font-medium text-slate-600">
                  {completed ? 'Completed' : 'Pending'}
                </span>
              </label>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-assignment-btn"
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm rounded-xl transition-all cursor-pointer"
            >
              {initialData ? 'Save Changes' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
