export type Priority = 'High' | 'Medium' | 'Low';

export type AssignmentSource =
  | 'WhatsApp'
  | 'Google Classroom'
  | 'Moodle / LMS'
  | 'Classroom Announcement'
  | 'Notebook / Lecture'
  | 'Email'
  | 'Other';

export type SubmissionType =
  | 'Online Portal'
  | 'Hard Copy'
  | 'Email / Drive'
  | 'In-Person Presentation'
  | 'Lab / Viva';

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // YYYY-MM-DD format
  dueTime: string; // HH:mm format (24hr), e.g. "23:59"
  priority: Priority;
  completed: boolean;
  completedAt?: string;
  source: AssignmentSource;
  submissionType: SubmissionType;
  notes?: string;
  estimatedHours?: number;
  createdAt: string;
}

export type TabType = 'all' | 'today' | 'this-week' | 'upcoming' | 'overdue' | 'completed';

export type SortOption = 'dueDate-asc' | 'dueDate-desc' | 'priority' | 'subject' | 'title';

export interface FilterState {
  tab: TabType;
  searchQuery: string;
  priority: 'all' | Priority;
  subject: string; // 'all' or specific subject name
  source: string; // 'all' or specific source
  sortBy: SortOption;
}
