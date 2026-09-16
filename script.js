/**
 * Student Deadline Companion
 * Core Vanilla JavaScript Application Logic
 * 
 * Features:
 * - Full CRUD for coursework assignments
 * - Automatic categorization (Overdue, Today, This Week, Upcoming, Completed)
 * - Multi-criteria live search, filtering (Priority, Subject, Source), and sorting
 * - Persistent browser localStorage
 * - Form validation with instant feedback
 * - Interactive Viva / College Review Guide modal with Design Thinking Process
 * - JSON Export / Import for project demonstration & backups
 */

// LocalStorage key definition
const STORAGE_KEY = 'student_deadline_companion_data_v2';

// Standard Initial College Coursework (Preloaded for review demonstration)
const DEFAULT_ASSIGNMENTS = [
  {
    id: 'asg-demo-1',
    title: 'AVL & Binary Search Tree Implementation Report',
    subject: 'Data Structures & Algorithms',
    dueDate: getFormattedOffsetDate(0), // Today
    dueTime: '23:59',
    priority: 'High',
    completed: false,
    source: 'Google Classroom',
    submissionType: 'Online Portal',
    notes: 'Implement insertion, deletion, and rotation tests in C++. Attach PDF with complexity analysis.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-demo-2',
    title: 'ER Diagram & Relational Normalization (BCNF)',
    subject: 'Database Management Systems',
    dueDate: getFormattedOffsetDate(0), // Today
    dueTime: '17:00',
    priority: 'Medium',
    completed: false,
    source: 'WhatsApp',
    submissionType: 'Online Portal',
    notes: 'Prof sent question paper in Class WhatsApp group. Normalize Hospital Management schema to 3NF & BCNF.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-demo-3',
    title: 'Semaphore & IPC Producer-Consumer Lab Code',
    subject: 'Operating Systems',
    dueDate: getFormattedOffsetDate(-1), // Overdue (Yesterday)
    dueTime: '23:59',
    priority: 'High',
    completed: false,
    source: 'Moodle / LMS',
    submissionType: 'Online Portal',
    notes: 'Submit POSIX semaphore code and terminal screenshots on university LMS.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-demo-4',
    title: 'Subnetting & CIDR Address Calculation Problem Set',
    subject: 'Computer Networks',
    dueDate: getFormattedOffsetDate(2), // In 2 days (This week)
    dueTime: '12:00',
    priority: 'Medium',
    completed: false,
    source: 'Notebook / Lecture',
    submissionType: 'Hard Copy',
    notes: 'Problems given during lecture on whiteboard. Hand in handwritten solution sheets during lab hours.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-demo-5',
    title: 'Agile Sprint Backlog & Jira User Story Document',
    subject: 'Software Engineering',
    dueDate: getFormattedOffsetDate(5), // In 5 days (This week)
    dueTime: '23:59',
    priority: 'Low',
    completed: false,
    source: 'Classroom Announcement',
    submissionType: 'Email / Drive',
    notes: 'Group project user stories and acceptance criteria. Share Google Doc link with the TA.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'asg-demo-6',
    title: 'Propositional Logic & Proof by Contradiction Exercise',
    subject: 'Discrete Mathematics',
    dueDate: getFormattedOffsetDate(-3), // Past completed
    dueTime: '15:30',
    priority: 'Low',
    completed: true,
    source: 'Google Classroom',
    submissionType: 'Online Portal',
    notes: 'Chapter 2 review problems 14 through 28.',
    createdAt: new Date().toISOString()
  }
];

// Application State
let assignments = [];
let currentTab = 'all'; // 'all', 'today', 'this-week', 'upcoming', 'overdue', 'completed'
let searchQuery = '';
let filterSubject = 'all';
let filterPriority = 'all';
let filterSource = 'all';
let sortBy = 'date-asc'; // 'date-asc', 'date-desc', 'priority-desc', 'subject', 'title'
let itemToDeleteId = null;

// DOM Elements
let assignmentsContainer;
let emptyStateEl;
let emptyTitleEl;
let emptyDescEl;
let emptyActionBtn;
let modalEl;
let modalTitleEl;
let assignmentForm;
let editIdInput;
let formTitleInput;
let formSubjectInput;
let formDateInput;
let formTimeInput;
let formSourceSelect;
let formModeSelect;
let formNotesTextarea;
let deleteModalEl;
let toastEl;
let searchInput;
let clearSearchBtn;
let filterSubjectSelect;
let filterPrioritySelect;
let filterSourceSelect;
let sortBySelect;
let resetFiltersBtn;
let subjectDatalist;
let guideModalEl;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  cacheElements();
  loadData();
  bindEvents();
  renderApp();
});

// Cache DOM references
function cacheElements() {
  assignmentsContainer = document.getElementById('assignments-container');
  emptyStateEl = document.getElementById('empty-state');
  emptyTitleEl = document.getElementById('empty-title');
  emptyDescEl = document.getElementById('empty-desc');
  emptyActionBtn = document.getElementById('empty-action-btn');
  
  modalEl = document.getElementById('assignment-modal');
  modalTitleEl = document.getElementById('modal-title');
  assignmentForm = document.getElementById('assignment-form');
  editIdInput = document.getElementById('edit-id');
  formTitleInput = document.getElementById('form-title');
  formSubjectInput = document.getElementById('form-subject');
  formDateInput = document.getElementById('form-date');
  formTimeInput = document.getElementById('form-time');
  formSourceSelect = document.getElementById('form-source');
  formModeSelect = document.getElementById('form-mode');
  formNotesTextarea = document.getElementById('form-notes');
  
  deleteModalEl = document.getElementById('delete-modal');
  toastEl = document.getElementById('toast');
  
  searchInput = document.getElementById('search-input');
  clearSearchBtn = document.getElementById('clear-search-btn');
  filterSubjectSelect = document.getElementById('filter-subject');
  filterPrioritySelect = document.getElementById('filter-priority');
  filterSourceSelect = document.getElementById('filter-source');
  sortBySelect = document.getElementById('sort-by');
  resetFiltersBtn = document.getElementById('reset-filters-btn');
  subjectDatalist = document.getElementById('subject-datalist');
  guideModalEl = document.getElementById('guide-modal');
}

// Event Bindings
function bindEvents() {
  // Modal open / close
  document.getElementById('open-modal-btn')?.addEventListener('click', () => openAddModal());
  document.getElementById('close-modal-btn')?.addEventListener('click', () => closeModal());
  document.getElementById('cancel-btn')?.addEventListener('click', () => closeModal());
  emptyActionBtn?.addEventListener('click', () => {
    if (searchQuery || filterSubject !== 'all' || filterPriority !== 'all' || filterSource !== 'all') {
      resetFilters();
    } else {
      openAddModal();
    }
  });

  // Modal Backdrop Click
  modalEl?.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });
  deleteModalEl?.addEventListener('click', (e) => {
    if (e.target === deleteModalEl) closeDeleteModal();
  });
  guideModalEl?.addEventListener('click', (e) => {
    if (e.target === guideModalEl) closeGuideModal();
  });

  // Guide Modal Buttons
  document.getElementById('open-guide-btn')?.addEventListener('click', () => openGuideModal());
  document.getElementById('banner-guide-btn')?.addEventListener('click', () => openGuideModal());
  document.getElementById('close-guide-btn')?.addEventListener('click', () => closeGuideModal());
  document.getElementById('guide-close-bottom-btn')?.addEventListener('click', () => closeGuideModal());

  // Guide Modal Tabs
  document.querySelectorAll('.guide-tab-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.guide-tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.guide-content-section').forEach((sec) => sec.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      document.getElementById(targetId)?.classList.add('active');
    });
  });

  // Demo Controls
  document.getElementById('load-demo-btn')?.addEventListener('click', () => loadDemoData());
  document.getElementById('banner-demo-btn')?.addEventListener('click', () => loadDemoData());
  document.getElementById('guide-load-demo-btn')?.addEventListener('click', () => {
    loadDemoData();
    closeGuideModal();
  });
  document.getElementById('export-json-btn')?.addEventListener('click', () => exportDataJSON());
  document.getElementById('import-json-btn')?.addEventListener('click', () => {
    document.getElementById('import-file-input')?.click();
  });
  document.getElementById('import-file-input')?.addEventListener('change', handleImportJSON);

  // Form Submission & Live Validation
  assignmentForm?.addEventListener('submit', handleFormSubmit);
  formTitleInput?.addEventListener('input', () => validateField(formTitleInput));
  formSubjectInput?.addEventListener('input', () => validateField(formSubjectInput));
  formDateInput?.addEventListener('input', () => validateField(formDateInput));

  // Quick Date Chips
  document.querySelectorAll('.date-chip').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      const days = parseInt(e.currentTarget.getAttribute('data-days'), 10);
      formDateInput.value = getFormattedOffsetDate(days);
      validateField(formDateInput);
      
      // Visual active state for chips
      document.querySelectorAll('.date-chip').forEach((c) => c.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });

  // Delete Confirm
  document.getElementById('cancel-delete-btn')?.addEventListener('click', () => closeDeleteModal());
  document.getElementById('confirm-delete-btn')?.addEventListener('click', () => confirmDelete());

  // Tabs Navigation
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      setTab(tab);
    });
  });

  // Stat Cards Click-to-filter
  document.querySelectorAll('.stat-card').forEach((card) => {
    card.addEventListener('click', () => {
      const tab = card.getAttribute('data-tab');
      setTab(tab);
    });
  });

  // Search & Filters
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
    renderApp();
  });

  clearSearchBtn?.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    renderApp();
  });

  filterSubjectSelect?.addEventListener('change', (e) => {
    filterSubject = e.target.value;
    renderApp();
  });

  filterPrioritySelect?.addEventListener('change', (e) => {
    filterPriority = e.target.value;
    renderApp();
  });

  filterSourceSelect?.addEventListener('change', (e) => {
    filterSource = e.target.value;
    renderApp();
  });

  sortBySelect?.addEventListener('change', (e) => {
    sortBy = e.target.value;
    renderApp();
  });

  resetFiltersBtn?.addEventListener('click', resetFilters);

  // Keyboard shortcut: Escape to close modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeDeleteModal();
      closeGuideModal();
    }
  });
}

// LocalStorage Helpers
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      assignments = JSON.parse(raw);
    } else {
      assignments = [...DEFAULT_ASSIGNMENTS];
      saveData();
    }
  } catch (err) {
    console.error('Failed to load assignments from localStorage:', err);
    assignments = [...DEFAULT_ASSIGNMENTS];
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  } catch (err) {
    console.error('Failed to save assignments to localStorage:', err);
    showToast('Failed to save data locally');
  }
}

function loadDemoData() {
  assignments = JSON.parse(JSON.stringify(DEFAULT_ASSIGNMENTS));
  saveData();
  populateSubjectDatalist();
  resetFilters();
  renderApp();
  showToast('Standard College Demo assignments loaded');
}

// Export / Import
function exportDataJSON() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(assignments, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `student_deadlines_backup_${getFormattedOffsetDate(0)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Coursework backup downloaded');
}

function handleImportJSON(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (Array.isArray(parsed)) {
        assignments = parsed;
        saveData();
        populateSubjectDatalist();
        renderApp();
        showToast('Backup successfully restored!');
      } else {
        showToast('Invalid backup file format.');
      }
    } catch (err) {
      showToast('Error reading backup JSON file.');
    }
  };
  reader.readAsText(file);
}

// Date Calculations & Categorization
function getFormattedOffsetDate(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCategory(asg) {
  if (asg.completed) return 'completed';
  const todayStr = getFormattedOffsetDate(0);

  if (asg.dueDate < todayStr) return 'overdue';
  if (asg.dueDate === todayStr) return 'today';
  return 'upcoming';
}

function isDueThisWeek(asg) {
  if (asg.completed) return false;
  const cat = getCategory(asg);
  if (cat === 'overdue') return false;

  const todayStr = getFormattedOffsetDate(0);
  const next7DaysStr = getFormattedOffsetDate(7);
  return asg.dueDate >= todayStr && asg.dueDate <= next7DaysStr;
}

function getRelativeDueInfo(asg) {
  if (asg.completed) {
    return { text: 'Completed', className: 'completed' };
  }

  const todayStr = getFormattedOffsetDate(0);
  const [y1, m1, d1] = todayStr.split('-').map(Number);
  const [y2, m2, d2] = asg.dueDate.split('-').map(Number);

  const d1Date = new Date(y1, m1 - 1, d1);
  const d2Date = new Date(y2, m2 - 1, d2);
  const diffDays = Math.round((d2Date.getTime() - d1Date.getTime()) / (1000 * 60 * 60 * 24));
  const weekday = d2Date.toLocaleDateString('en-US', { weekday: 'short' });

  const timeFormatted = formatTimeDisplay(asg.dueTime);

  if (diffDays < 0) {
    const daysOverdue = Math.abs(diffDays);
    return {
      text: daysOverdue === 1 ? 'Overdue by 1 day' : `Overdue by ${daysOverdue} days`,
      className: 'overdue'
    };
  }

  if (diffDays === 0) {
    return {
      text: timeFormatted ? `Due today at ${timeFormatted}` : 'Due today before midnight',
      className: 'today'
    };
  }

  if (diffDays === 1) {
    return {
      text: timeFormatted ? `Due tomorrow (${weekday}) at ${timeFormatted}` : `Due tomorrow (${weekday})`,
      className: 'this-week'
    };
  }

  if (diffDays <= 7) {
    return {
      text: `Due in ${diffDays} days (${weekday})`,
      className: 'this-week'
    };
  }

  return {
    text: `Due in ${diffDays} days (${formatStandardDate(asg.dueDate)})`,
    className: 'upcoming'
  };
}

function formatTimeDisplay(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours)) return timeStr;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${ampm}`;
}

function formatStandardDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Navigation Tab Management
function setTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
  });
  document.querySelectorAll('.stat-card').forEach((card) => {
    card.classList.toggle('active', card.getAttribute('data-tab') === tab);
  });
  renderApp();
}

function resetFilters() {
  currentTab = 'all';
  searchQuery = '';
  filterSubject = 'all';
  filterPriority = 'all';
  if (filterSourceSelect) filterSource = 'all';
  sortBy = 'date-asc';

  if (searchInput) searchInput.value = '';
  if (clearSearchBtn) clearSearchBtn.style.display = 'none';
  if (filterSubjectSelect) filterSubjectSelect.value = 'all';
  if (filterPrioritySelect) filterPrioritySelect.value = 'all';
  if (filterSourceSelect) filterSourceSelect.value = 'all';
  if (sortBySelect) sortBySelect.value = 'date-asc';

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === 'all');
  });
  document.querySelectorAll('.stat-card').forEach((card) => {
    card.classList.toggle('active', card.getAttribute('data-tab') === 'all');
  });

  renderApp();
}

// Main Render Function
function renderApp() {
  // Update Counts for Stat Cards & Tabs
  let totalCount = assignments.length;
  let todayCount = 0;
  let thisWeekCount = 0;
  let upcomingCount = 0;
  let overdueCount = 0;
  let completedCount = 0;

  assignments.forEach((a) => {
    const cat = getCategory(a);
    if (cat === 'completed') {
      completedCount++;
    } else {
      if (cat === 'overdue') overdueCount++;
      else if (cat === 'today') todayCount++;
      else upcomingCount++;

      if (isDueThisWeek(a)) {
        thisWeekCount++;
      }
    }
  });

  // DOM counts updates
  updateElementText('count-all', totalCount);
  updateElementText('count-today', todayCount);
  updateElementText('count-this-week', thisWeekCount);
  updateElementText('count-overdue', overdueCount);
  updateElementText('count-completed', completedCount);

  updateElementText('tab-count-all', totalCount);
  updateElementText('tab-count-today', todayCount);
  updateElementText('tab-count-this-week', thisWeekCount);
  updateElementText('tab-count-upcoming', upcomingCount);
  updateElementText('tab-count-overdue', overdueCount);
  updateElementText('tab-count-completed', completedCount);

  // Progress Bar
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const progressFill = document.getElementById('progress-fill');
  if (progressFill) progressFill.style.width = `${completionPercentage}%`;
  updateElementText('progress-percentage', `${completionPercentage}%`);
  updateElementText('progress-fraction', `${completedCount} of ${totalCount} completed`);

  // Filter List
  let filtered = assignments.filter((a) => {
    const cat = getCategory(a);

    // Tab Filter
    if (currentTab === 'today' && cat !== 'today') return false;
    if (currentTab === 'this-week' && !isDueThisWeek(a)) return false;
    if (currentTab === 'upcoming' && cat !== 'upcoming') return false;
    if (currentTab === 'overdue' && cat !== 'overdue') return false;
    if (currentTab === 'completed' && !a.completed) return false;

    // Search Query
    if (searchQuery) {
      const titleMatch = a.title.toLowerCase().includes(searchQuery);
      const subjectMatch = a.subject.toLowerCase().includes(searchQuery);
      const notesMatch = (a.notes || '').toLowerCase().includes(searchQuery);
      const sourceMatch = (a.source || '').toLowerCase().includes(searchQuery);
      if (!titleMatch && !subjectMatch && !notesMatch && !sourceMatch) return false;
    }

    // Dropdown Filters
    if (filterSubject !== 'all' && a.subject !== filterSubject) return false;
    if (filterPriority !== 'all' && a.priority !== filterPriority) return false;
    if (filterSource !== 'all' && a.source !== filterSource) return false;

    return true;
  });

  // Sort List
  const priorityWeights = { High: 3, Medium: 2, Low: 1 };
  filtered.sort((a, b) => {
    if (sortBy === 'date-asc') {
      return a.dueDate.localeCompare(b.dueDate) || (a.dueTime || '23:59').localeCompare(b.dueTime || '23:59');
    }
    if (sortBy === 'date-desc') {
      return b.dueDate.localeCompare(a.dueDate) || (b.dueTime || '23:59').localeCompare(a.dueTime || '23:59');
    }
    if (sortBy === 'priority-desc') {
      return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
    }
    if (sortBy === 'subject') {
      return a.subject.localeCompare(b.subject);
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Show/Hide Reset Filters Button
  const hasFilters = Boolean(
    searchQuery ||
    filterSubject !== 'all' ||
    filterPriority !== 'all' ||
    (filterSource && filterSource !== 'all') ||
    currentTab !== 'all'
  );
  if (resetFiltersBtn) {
    resetFiltersBtn.style.display = hasFilters ? 'inline-flex' : 'none';
  }

  // Update Section Title & Count
  const tabTitles = {
    all: 'All Coursework Assignments',
    today: "Today's Deadlines",
    'this-week': "This Week's Deadlines (Next 7 Days)",
    upcoming: 'Upcoming Deadlines',
    overdue: 'Overdue Coursework',
    completed: 'Completed Assignments'
  };
  updateElementText('current-view-title', tabTitles[currentTab] || 'Assignments');
  updateElementText('items-count-text', `Showing ${filtered.length} assignment${filtered.length === 1 ? '' : 's'}`);

  // Handle Empty State
  if (filtered.length === 0) {
    assignmentsContainer.style.display = 'none';
    emptyStateEl.style.display = 'block';

    if (hasFilters) {
      emptyTitleEl.textContent = 'No matching assignments found';
      emptyDescEl.textContent = 'Try adjusting your search query, priority filter, or subject criteria.';
      emptyActionBtn.textContent = 'Clear All Filters';
    } else if (currentTab === 'today') {
      emptyTitleEl.textContent = 'Zero deadlines today! 🎉';
      emptyDescEl.textContent = 'You are completely caught up for today. Relax or review upcoming material.';
      emptyActionBtn.textContent = 'Add Assignment';
    } else if (currentTab === 'this-week') {
      emptyTitleEl.textContent = 'No deadlines this week! 🗓️';
      emptyDescEl.textContent = 'Your schedule is clear for the next 7 days.';
      emptyActionBtn.textContent = 'Add Assignment';
    } else if (currentTab === 'overdue') {
      emptyTitleEl.textContent = 'No overdue assignments! 🏆';
      emptyDescEl.textContent = 'Outstanding work keeping on top of all academic submissions.';
      emptyActionBtn.textContent = 'Add Assignment';
    } else if (currentTab === 'completed') {
      emptyTitleEl.textContent = 'No completed assignments yet';
      emptyDescEl.textContent = 'Check off assignments from your dashboard as you finish them.';
      emptyActionBtn.textContent = 'View Pending Assignments';
    } else {
      emptyTitleEl.textContent = 'No coursework recorded';
      emptyDescEl.textContent = 'Add assignments from WhatsApp messages, classroom boards, or syllabus notes.';
      emptyActionBtn.textContent = 'Add First Assignment';
    }
    return;
  }

  assignmentsContainer.style.display = 'flex';
  emptyStateEl.style.display = 'none';

  // Render Grouped Sections when in "All" view with no search query
  if (currentTab === 'all' && !searchQuery && filterSubject === 'all' && filterPriority === 'all' && filterSource === 'all') {
    const overdueList = filtered.filter((a) => !a.completed && getCategory(a) === 'overdue');
    const todayList = filtered.filter((a) => !a.completed && getCategory(a) === 'today');
    const thisWeekList = filtered.filter((a) => !a.completed && getCategory(a) !== 'today' && isDueThisWeek(a));
    const laterList = filtered.filter((a) => !a.completed && getCategory(a) === 'upcoming' && !isDueThisWeek(a));
    const completedList = filtered.filter((a) => a.completed);

    let html = '';

    if (overdueList.length > 0) {
      html += `
        <div class="group-header">
          <span>⚠️ Overdue Assignments</span>
          <span class="group-badge overdue">${overdueList.length}</span>
        </div>
      `;
      html += overdueList.map(renderCardHTML).join('');
    }

    if (todayList.length > 0) {
      html += `
        <div class="group-header">
          <span>⏰ Due Today</span>
          <span class="group-badge today">${todayList.length}</span>
        </div>
      `;
      html += todayList.map(renderCardHTML).join('');
    }

    if (thisWeekList.length > 0) {
      html += `
        <div class="group-header">
          <span>🗓️ Due This Week (Next 7 Days)</span>
          <span class="group-badge this-week">${thisWeekList.length}</span>
        </div>
      `;
      html += thisWeekList.map(renderCardHTML).join('');
    }

    if (laterList.length > 0) {
      html += `
        <div class="group-header">
          <span>📅 Later Upcoming Deadlines</span>
          <span class="group-badge upcoming">${laterList.length}</span>
        </div>
      `;
      html += laterList.map(renderCardHTML).join('');
    }

    if (completedList.length > 0) {
      html += `
        <div class="group-header">
          <span>✅ Completed Assignments</span>
          <span class="group-badge completed">${completedList.length}</span>
        </div>
      `;
      html += completedList.map(renderCardHTML).join('');
    }

    assignmentsContainer.innerHTML = html;
  } else {
    // Flat Card List for specific tab or active search/filter
    assignmentsContainer.innerHTML = filtered.map(renderCardHTML).join('');
  }

  attachCardEvents();
}

// Generate Card HTML
function renderCardHTML(asg) {
  const cat = getCategory(asg);
  const dueInfo = getRelativeDueInfo(asg);
  const sourceIcon = getSourceIcon(asg.source);
  const modeIcon = getModeIcon(asg.submissionType);

  let statusClass = '';
  if (asg.completed) statusClass = 'completed-card';
  else if (cat === 'overdue') statusClass = 'overdue-card';
  else if (cat === 'today') statusClass = 'today-card';
  else if (isDueThisWeek(asg)) statusClass = 'this-week-card';

  return `
    <article class="assignment-card ${statusClass}" data-id="${asg.id}">
      <div class="card-checkbox-container">
        <input 
          type="checkbox" 
          class="complete-checkbox" 
          data-id="${asg.id}" 
          ${asg.completed ? 'checked' : ''} 
          title="${asg.completed ? 'Mark as incomplete' : 'Mark as completed'}"
        />
      </div>

      <div class="card-content">
        <div class="card-top-row">
          <h3 class="card-title">${escapeHTML(asg.title)}</h3>
          <div class="card-actions">
            <button class="action-btn edit-btn" data-id="${asg.id}" title="Edit Assignment">✏️</button>
            <button class="action-btn delete delete-btn" data-id="${asg.id}" title="Delete Assignment">🗑️</button>
          </div>
        </div>

        <div class="card-subject">${escapeHTML(asg.subject)}</div>

        <div class="card-meta-row">
          <span class="meta-chip priority-${asg.priority.toLowerCase()}">
            ${asg.priority === 'High' ? '🔴' : asg.priority === 'Medium' ? '🟠' : '🟢'} ${asg.priority} Priority
          </span>

          <span class="meta-chip due-badge ${dueInfo.className}">
            ${dueInfo.text}
          </span>

          ${asg.source ? `
            <span class="meta-chip source">
              ${sourceIcon} ${escapeHTML(asg.source)}
            </span>
          ` : ''}

          ${asg.submissionType ? `
            <span class="meta-chip mode">
              ${modeIcon} ${escapeHTML(asg.submissionType)}
            </span>
          ` : ''}
        </div>

        ${asg.notes ? `
          <div class="card-notes">${escapeHTML(asg.notes)}</div>
        ` : ''}
      </div>
    </article>
  `;
}

// Icons for Sources & Modes
function getSourceIcon(source) {
  switch (source) {
    case 'WhatsApp': return '💬';
    case 'Google Classroom': return '🏫';
    case 'Moodle / LMS': return '💻';
    case 'Classroom Announcement': return '📢';
    case 'Notebook / Lecture': return '📓';
    default: return '📌';
  }
}

function getModeIcon(mode) {
  switch (mode) {
    case 'Online Portal': return '🌐';
    case 'Hard Copy': return '📄';
    case 'Email / Drive': return '📧';
    case 'Lab / Presentation': return '🔬';
    default: return '📤';
  }
}

// Attach Event Listeners to rendered cards
function attachCardEvents() {
  // Complete Checkbox Toggle
  document.querySelectorAll('.complete-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
      const id = e.target.getAttribute('data-id');
      toggleAssignmentComplete(id);
    });
  });

  // Edit Button
  document.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      openEditModal(id);
    });
  });

  // Delete Button
  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      promptDelete(id);
    });
  });
}

// Toggle Complete
function toggleAssignmentComplete(id) {
  const asg = assignments.find((a) => a.id === id);
  if (!asg) return;

  asg.completed = !asg.completed;
  saveData();
  renderApp();

  showToast(asg.completed ? 'Assignment marked completed! 🎓' : 'Assignment marked pending');
}

// Modal Handlers: Add & Edit
function openAddModal() {
  editIdInput.value = '';
  modalTitleEl.textContent = 'Add New Assignment';
  assignmentForm.reset();

  // Reset errors
  clearFormErrors();

  // Defaults
  formDateInput.value = getFormattedOffsetDate(0);
  formTimeInput.value = '23:59';
  const medPriorityRadio = document.querySelector('input[name="form-priority"][value="Medium"]');
  if (medPriorityRadio) medPriorityRadio.checked = true;

  modalEl.style.display = 'flex';
  formTitleInput.focus();
}

function openEditModal(id) {
  const asg = assignments.find((a) => a.id === id);
  if (!asg) return;

  clearFormErrors();
  editIdInput.value = asg.id;
  modalTitleEl.textContent = 'Edit Assignment';

  formTitleInput.value = asg.title;
  formSubjectInput.value = asg.subject;
  formDateInput.value = asg.dueDate;
  formTimeInput.value = asg.dueTime || '23:59';
  formSourceSelect.value = asg.source || 'Other';
  formModeSelect.value = asg.submissionType || 'Online Portal';
  formNotesTextarea.value = asg.notes || '';

  const priorityRadio = document.querySelector(`input[name="form-priority"][value="${asg.priority}"]`);
  if (priorityRadio) priorityRadio.checked = true;

  modalEl.style.display = 'flex';
  formTitleInput.focus();
}

function closeModal() {
  if (modalEl) modalEl.style.display = 'none';
  clearFormErrors();
}

// Delete Confirmation Modal
function promptDelete(id) {
  const asg = assignments.find((a) => a.id === id);
  if (!asg) return;

  itemToDeleteId = id;
  const deleteMsg = document.getElementById('delete-message');
  if (deleteMsg) {
    deleteMsg.textContent = `Are you sure you want to delete "${asg.title}"? This cannot be undone.`;
  }
  deleteModalEl.style.display = 'flex';
}

function closeDeleteModal() {
  itemToDeleteId = null;
  if (deleteModalEl) deleteModalEl.style.display = 'none';
}

function confirmDelete() {
  if (!itemToDeleteId) return;

  assignments = assignments.filter((a) => a.id !== itemToDeleteId);
  saveData();
  populateSubjectDatalist();
  closeDeleteModal();
  renderApp();
  showToast('Assignment deleted');
}

// Guide / Viva Presentation Modal
function openGuideModal() {
  if (guideModalEl) guideModalEl.style.display = 'flex';
}

function closeGuideModal() {
  if (guideModalEl) guideModalEl.style.display = 'none';
}

// Form Validation and Submission
function validateField(input) {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return true;

  const val = input.value.trim();
  let isValid = true;

  if (input.id === 'form-title') {
    isValid = val.length >= 3;
  } else if (input.id === 'form-subject') {
    isValid = val.length >= 2;
  } else if (input.id === 'form-date') {
    isValid = Boolean(val);
  }

  formGroup.classList.toggle('has-error', !isValid);
  return isValid;
}

function clearFormErrors() {
  document.querySelectorAll('.form-group.has-error').forEach((fg) => {
    fg.classList.remove('has-error');
  });
}

function handleFormSubmit(e) {
  e.preventDefault();

  const isTitleValid = validateField(formTitleInput);
  const isSubjectValid = validateField(formSubjectInput);
  const isDateValid = validateField(formDateInput);

  if (!isTitleValid || !isSubjectValid || !isDateValid) {
    showToast('Please fix required fields marked in red.');
    return;
  }

  const title = formTitleInput.value.trim();
  const subject = formSubjectInput.value.trim();
  const dueDate = formDateInput.value;
  const dueTime = formTimeInput.value || '23:59';
  const priorityRadio = document.querySelector('input[name="form-priority"]:checked');
  const priority = priorityRadio ? priorityRadio.value : 'Medium';
  const source = formSourceSelect.value;
  const submissionType = formModeSelect.value;
  const notes = formNotesTextarea.value.trim();

  const editId = editIdInput.value;

  if (editId) {
    // Edit existing
    const asg = assignments.find((a) => a.id === editId);
    if (asg) {
      asg.title = title;
      asg.subject = subject;
      asg.dueDate = dueDate;
      asg.dueTime = dueTime;
      asg.priority = priority;
      asg.source = source;
      asg.submissionType = submissionType;
      asg.notes = notes;
      showToast('Assignment updated successfully');
    }
  } else {
    // Create new
    const newAsg = {
      id: 'asg-' + Date.now(),
      title,
      subject,
      dueDate,
      dueTime,
      priority,
      completed: false,
      source,
      submissionType,
      notes,
      createdAt: new Date().toISOString()
    };
    assignments.unshift(newAsg);
    showToast('Assignment added successfully! 🚀');
  }

  saveData();
  populateSubjectDatalist();
  closeModal();
  renderApp();
}

// Dynamically populate subjects in datalist and dropdown
function populateSubjectDatalist() {
  const subjects = Array.from(new Set(assignments.map((a) => a.subject).filter(Boolean))).sort();

  if (subjectDatalist) {
    subjectDatalist.innerHTML = subjects.map((s) => `<option value="${escapeHTML(s)}"></option>`).join('');
  }

  if (filterSubjectSelect) {
    const currentVal = filterSubjectSelect.value;
    let opts = '<option value="all">All Subjects</option>';
    subjects.forEach((s) => {
      opts += `<option value="${escapeHTML(s)}">${escapeHTML(s)}</option>`;
    });
    filterSubjectSelect.innerHTML = opts;
    if (subjects.includes(currentVal)) {
      filterSubjectSelect.value = currentVal;
    } else {
      filterSubjectSelect.value = 'all';
      filterSubject = 'all';
    }
  }
}

// Utility: Toast Notification
let toastTimer = null;
function showToast(message) {
  if (!toastEl) return;
  if (toastTimer) clearTimeout(toastTimer);

  toastEl.textContent = message;
  toastEl.style.display = 'flex';

  toastTimer = setTimeout(() => {
    toastEl.style.display = 'none';
  }, 2800);
}

// Utility: Safe Text Update
function updateElementText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// Utility: HTML Escaping
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
