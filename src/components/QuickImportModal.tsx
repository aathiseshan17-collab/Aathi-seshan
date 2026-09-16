import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Copy,
  ArrowRight,
  MessageSquare,
  Building2,
  BookOpen,
} from 'lucide-react';
import { Assignment, AssignmentSource, Priority, SubmissionType } from '../types';
import { getOffsetDateString, getTodayDateString } from '../utils/dateUtils';
import { COMMON_SUBJECTS } from '../data/initialData';

interface QuickImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => void;
}

export const QuickImportModal: React.FC<QuickImportModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [rawText, setRawText] = useState('');
  const [parsedTitle, setParsedTitle] = useState('');
  const [parsedSubject, setParsedSubject] = useState('');
  const [parsedDate, setParsedDate] = useState(getOffsetDateString(2));
  const [parsedTime, setParsedTime] = useState('23:59');
  const [parsedPriority, setParsedPriority] = useState<Priority>('High');
  const [parsedSource, setParsedSource] = useState<AssignmentSource>('WhatsApp');
  const [hasParsed, setHasParsed] = useState(false);

  if (!isOpen) return null;

  // Sample templates students frequently encounter
  const sampleMessages = [
    {
      label: 'WhatsApp Class Group',
      text: 'Hey everyone, Prof. Sharma posted DBMS Assignment 3 (Relational Algebra & Normalization). Due this Friday at 11:59 PM on LMS. Late submissions not accepted.',
      source: 'WhatsApp' as AssignmentSource,
    },
    {
      label: 'Class Announcement',
      text: 'Reminder: Operating Systems Lab 4 on CPU Scheduling Algorithms report is due tomorrow at 5:00 PM. Hard copy submission during lab.',
      source: 'Classroom Announcement' as AssignmentSource,
    },
    {
      label: 'Google Classroom Post',
      text: 'Data Structures: Tree Traversals & Graph BFS problem set is posted. Submission deadline is in 3 days. Total marks: 20.',
      source: 'Google Classroom' as AssignmentSource,
    },
  ];

  const handlePasteSample = (sample: typeof sampleMessages[0]) => {
    setRawText(sample.text);
    autoParse(sample.text, sample.source);
  };

  const autoParse = (text: string, defaultSource: AssignmentSource = 'WhatsApp') => {
    if (!text.trim()) return;

    // Detect subject from text
    let detectedSubject = 'General Coursework';
    for (const sub of COMMON_SUBJECTS) {
      const words = sub.toLowerCase().split(' ');
      if (words.some((w) => w.length > 3 && text.toLowerCase().includes(w))) {
        detectedSubject = sub;
        break;
      }
    }
    if (text.toLowerCase().includes('dbms') || text.toLowerCase().includes('database')) {
      detectedSubject = 'Database Management Systems';
    } else if (text.toLowerCase().includes('os') || text.toLowerCase().includes('operating system')) {
      detectedSubject = 'Operating Systems';
    } else if (text.toLowerCase().includes('dsa') || text.toLowerCase().includes('data structure') || text.toLowerCase().includes('tree') || text.toLowerCase().includes('graph')) {
      detectedSubject = 'Data Structures & Algorithms';
    } else if (text.toLowerCase().includes('network') || text.toLowerCase().includes('ip') || text.toLowerCase().includes('tcp')) {
      detectedSubject = 'Computer Networks';
    }

    // Detect priority
    let detectedPriority: Priority = 'Medium';
    if (text.toLowerCase().includes('urgent') || text.toLowerCase().includes('asap') || text.toLowerCase().includes('important') || text.toLowerCase().includes('tomorrow') || text.toLowerCase().includes('late submissions not accepted')) {
      detectedPriority = 'High';
    } else if (text.toLowerCase().includes('optional') || text.toLowerCase().includes('extra credit')) {
      detectedPriority = 'Low';
    }

    // Detect date
    let detectedDate = getOffsetDateString(2);
    if (text.toLowerCase().includes('today')) {
      detectedDate = getTodayDateString();
    } else if (text.toLowerCase().includes('tomorrow')) {
      detectedDate = getOffsetDateString(1);
    } else if (text.toLowerCase().includes('friday')) {
      detectedDate = getOffsetDateString(3);
    } else if (text.toLowerCase().includes('monday')) {
      detectedDate = getOffsetDateString(5);
    }

    // Detect time
    let detectedTime = '23:59';
    if (text.toLowerCase().includes('5:00 pm') || text.toLowerCase().includes('5pm')) {
      detectedTime = '17:00';
    } else if (text.toLowerCase().includes('11:59 pm') || text.toLowerCase().includes('midnight')) {
      detectedTime = '23:59';
    }

    // Generate a clean title
    let titleCandidate = text.split(/[.\n]/)[0].trim();
    if (titleCandidate.length > 70) {
      titleCandidate = titleCandidate.substring(0, 67) + '...';
    }

    setParsedSubject(detectedSubject);
    setParsedTitle(titleCandidate || 'New Course Assignment');
    setParsedDate(detectedDate);
    setParsedTime(detectedTime);
    setParsedPriority(detectedPriority);
    setParsedSource(defaultSource);
    setHasParsed(true);
  };

  const handleApply = () => {
    onSave({
      title: parsedTitle || 'New Course Assignment',
      subject: parsedSubject || 'General Coursework',
      dueDate: parsedDate,
      dueTime: parsedTime,
      priority: parsedPriority,
      source: parsedSource,
      submissionType: 'Online Portal' as SubmissionType,
      notes: rawText ? `Original message: "${rawText}"` : undefined,
      completed: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden relative"
        role="dialog"
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 to-blue-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Quick Paste from WhatsApp or LMS
              </h2>
              <p className="text-xs text-slate-500">
                Paste raw messages to instantly extract assignment & deadline
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Quick templates */}
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1.5">
              Try a sample college message:
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleMessages.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePasteSample(s)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors font-medium text-slate-700 cursor-pointer text-left"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Paste Input */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
              Paste announcement or text message here:
            </label>
            <textarea
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                autoParse(e.target.value);
              }}
              rows={3}
              placeholder="e.g. OS Lab 3 due next Tuesday by 5pm on Google Classroom. Submit code files + pdf..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 resize-none"
            />
          </div>

          {/* Parsed Preview Card */}
          {hasParsed && (
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">
                  Extracted Details (Editable)
                </span>
                <span className="text-xs text-indigo-600 font-medium">Ready to save</span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <label className="text-xs text-slate-500 block font-medium">Title:</label>
                  <input
                    type="text"
                    value={parsedTitle}
                    onChange={(e) => setParsedTitle(e.target.value)}
                    className="w-full mt-0.5 px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-indigo-200 rounded-lg font-semibold text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-500 block font-medium">Subject:</label>
                    <input
                      type="text"
                      value={parsedSubject}
                      onChange={(e) => setParsedSubject(e.target.value)}
                      className="w-full mt-0.5 px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-indigo-200 rounded-lg text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 block font-medium">Due Date:</label>
                    <input
                      type="date"
                      value={parsedDate}
                      onChange={(e) => setParsedDate(e.target.value)}
                      className="w-full mt-0.5 px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-indigo-200 rounded-lg text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-slate-500 block font-medium">Time:</label>
                    <input
                      type="time"
                      value={parsedTime}
                      onChange={(e) => setParsedTime(e.target.value)}
                      className="w-full mt-0.5 px-2 py-1 text-xs bg-white border border-indigo-200 rounded-lg text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block font-medium">Priority:</label>
                    <select
                      value={parsedPriority}
                      onChange={(e) => setParsedPriority(e.target.value as Priority)}
                      className="w-full mt-0.5 px-2 py-1 text-xs bg-white border border-indigo-200 rounded-lg text-slate-800 focus:outline-none"
                    >
                      <option value="High">🔴 High</option>
                      <option value="Medium">🟠 Medium</option>
                      <option value="Low">🟢 Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block font-medium">Source:</label>
                    <select
                      value={parsedSource}
                      onChange={(e) => setParsedSource(e.target.value as AssignmentSource)}
                      className="w-full mt-0.5 px-2 py-1 text-xs bg-white border border-indigo-200 rounded-lg text-slate-800 focus:outline-none"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Google Classroom">Classroom</option>
                      <option value="Moodle / LMS">Moodle LMS</option>
                      <option value="Classroom Announcement">Announcement</option>
                      <option value="Notebook / Lecture">Notebook</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              id="confirm-quick-import-btn"
              disabled={!parsedTitle}
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm rounded-xl transition-all cursor-pointer"
            >
              <span>Add to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
