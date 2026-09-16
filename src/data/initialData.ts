import { Assignment } from '../types';
import { getOffsetDateString, getTodayDateString } from '../utils/dateUtils';

export function getInitialAssignments(): Assignment[] {
  return [
    {
      id: 'asg-1',
      title: 'Binary Search Tree & AVL Tree Implementation',
      subject: 'Data Structures & Algorithms',
      dueDate: getTodayDateString(),
      dueTime: '23:59',
      priority: 'High',
      completed: false,
      source: 'Google Classroom',
      submissionType: 'Online Portal',
      notes: 'Include test cases and time complexity analysis in README.pdf. Submit zip to portal.',
      estimatedHours: 4,
      createdAt: getOffsetDateString(-3),
    },
    {
      id: 'asg-2',
      title: 'ER Diagram & Relational Schema Normalization (BCNF)',
      subject: 'Database Management Systems',
      dueDate: getTodayDateString(),
      dueTime: '17:00',
      priority: 'Medium',
      completed: false,
      source: 'WhatsApp',
      submissionType: 'Online Portal',
      notes: 'Prof shared prompt in class WhatsApp group: normalize Hospital Management schema to 3NF and BCNF.',
      estimatedHours: 2.5,
      createdAt: getOffsetDateString(-2),
    },
    {
      id: 'asg-3',
      title: 'Process Synchronization & Semaphore Lab Report',
      subject: 'Operating Systems',
      dueDate: getOffsetDateString(-1), // Overdue
      dueTime: '23:59',
      priority: 'High',
      completed: false,
      source: 'Moodle / LMS',
      submissionType: 'Online Portal',
      notes: 'Producer-Consumer problem implementation in C with POSIX semaphores. Late submission penalty 10%/day.',
      estimatedHours: 3,
      createdAt: getOffsetDateString(-5),
    },
    {
      id: 'asg-4',
      title: 'Subnetting & CIDR Calculation Problem Set',
      subject: 'Computer Networks',
      dueDate: getOffsetDateString(2), // Upcoming
      dueTime: '11:59',
      priority: 'Medium',
      completed: false,
      source: 'Classroom Announcement',
      submissionType: 'Hard Copy',
      notes: 'Problems 4.1 to 4.15 from Kurose & Ross textbook. Submit handwritten copy during Wednesday lecture.',
      estimatedHours: 2,
      createdAt: getOffsetDateString(-1),
    },
    {
      id: 'asg-5',
      title: 'Sprint 2 Agile Architecture & User Stories',
      subject: 'Software Engineering',
      dueDate: getOffsetDateString(4), // Upcoming
      dueTime: '23:59',
      priority: 'Low',
      completed: false,
      source: 'WhatsApp',
      submissionType: 'Email / Drive',
      notes: 'Team project document: Jira board screenshot, burn-down chart, and API contracts.',
      estimatedHours: 5,
      createdAt: getOffsetDateString(-2),
    },
    {
      id: 'asg-6',
      title: 'Graph Theory Proofs on Euler & Hamilton Paths',
      subject: 'Discrete Mathematics',
      dueDate: getOffsetDateString(6), // Upcoming
      dueTime: '18:00',
      priority: 'Medium',
      completed: false,
      source: 'Notebook / Lecture',
      submissionType: 'Hard Copy',
      notes: 'Noted from blackboard during Monday lecture. Questions written on page 42.',
      estimatedHours: 3,
      createdAt: getOffsetDateString(-1),
    },
    {
      id: 'asg-7',
      title: 'Literature Review on Microservices vs Monoliths',
      subject: 'Software Engineering',
      dueDate: getOffsetDateString(-3), // Completed
      dueTime: '14:00',
      priority: 'Low',
      completed: true,
      completedAt: getOffsetDateString(-3),
      source: 'Google Classroom',
      submissionType: 'Online Portal',
      notes: 'Submitted via classroom portal. 1500 words with IEEE reference citations.',
      estimatedHours: 4,
      createdAt: getOffsetDateString(-7),
    },
  ];
}

export const COMMON_SUBJECTS = [
  'Data Structures & Algorithms',
  'Database Management Systems',
  'Operating Systems',
  'Computer Networks',
  'Software Engineering',
  'Discrete Mathematics',
  'Artificial Intelligence',
  'Web Development',
];

export const SOURCE_OPTIONS = [
  'WhatsApp',
  'Google Classroom',
  'Moodle / LMS',
  'Classroom Announcement',
  'Notebook / Lecture',
  'Email',
  'Other',
] as const;

export const SUBMISSION_OPTIONS = [
  'Online Portal',
  'Hard Copy',
  'Email / Drive',
  'In-Person Presentation',
  'Lab / Viva',
] as const;
