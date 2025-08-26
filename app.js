// Schedule data
const scheduleData = [
  { "day": "Monday", "start": "11:20", "end": "13:20", "course": "OOPS B.tech 3rd", "location": "Design Block" },
  { "day": "Monday", "start": "14:30", "end": "16:30", "course": "PYTHON BCA 3rd", "location": "Management Block" },
  { "day": "Tuesday", "start": "09:00", "end": "11:00", "course": "DBMS B.tech 2nd", "location": "Management Block" },
  { "day": "Tuesday", "start": "11:20", "end": "13:20", "course": "ML - MCA 3rd", "location": "DesignBlock" },
  { "day": "Tuesday", "start": "14:30", "end": "16:30", "course": "PPS GR(A) B.tech 1st", "location": "Design Block" },
  { "day": "Wednesday", "start": "11:20", "end": "13:20", "course": "DBMS(VF) BCA 3rd", "location": "Management Block" },
  { "day": "Wednesday", "start": "14:30", "end": "16:30", "course": "Competitive Coding", "location": "CR4 Law Ext" },
  { "day": "Wednesday", "start": "14:30", "end": "16:30", "course": "Programming in C MCA 1st sem", "location": "Management Block" },
  { "day": "Thursday", "start": "09:00", "end": "11:00", "course": "C- Lab BCA 1st", "location": "Management Block" },
  { "day": "Thursday", "start": "11:20", "end": "13:20", "course": "DVI BSC 5th", "location": "Management Block" },
  { "day": "Thursday", "start": "14:30", "end": "16:30", "course": "PPS Group B B.tech 1st", "location": "Design Block" },
  { "day": "Thursday", "start": "14:30", "end": "16:30", "course": "Software Engineering MCA 3rd Lab", "location": "Law Extension" },
  { "day": "Friday", "start": "11:20", "end": "13:20", "course": "DBMS MCA 1st", "location": "Management Block" },
  { "day": "Friday", "start": "14:30", "end": "16:30", "course": "Competitive Coding B.tech 3rd", "location": "CR4 Law Ext" }
];

// To-do list storage
let todos = [];
let todoIdCounter = 1;

// DOM elements - will be initialized after DOM loads
let scheduleContainer, dayFilter, todoForm, todoList, todoDate, todoTime, todoContent;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    scheduleContainer = document.getElementById('scheduleContainer');
    dayFilter = document.getElementById('dayFilter');
    todoForm = document.getElementById('todoForm');
    todoList = document.getElementById('todoList');
    todoDate = document.getElementById('todoDate');
    todoTime = document.getElementById('todoTime');
    todoContent = document.getElementById('todoContent');
    
    // Verify elements exist
    if (!scheduleContainer || !dayFilter || !todoForm) {
        console.error('Required DOM elements not found');
        return;
    }
    
    // Initialize application
    renderSchedule();
    renderTodos();
    setupEventListeners();
    setDefaultDate();
});

// Set default date to today
function setDefaultDate() {
    if (todoDate) {
        const today = new Date();
        todoDate.value = today.toISOString().split('T')[0];
    }
}

// Setup event listeners
function setupEventListeners() {
    // Day filter change listener
    if (dayFilter) {
        dayFilter.addEventListener('change', function() {
            renderSchedule();
        });
    }
    
    // Todo form submit listener
    if (todoForm) {
        todoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleTodoSubmit();
        });
    }
}

// Render schedule based on current filter
function renderSchedule() {
    if (!scheduleContainer || !dayFilter) return;
    
    const selectedDay = dayFilter.value;
    let filteredData = scheduleData;
    
    if (selectedDay !== 'all') {
        filteredData = scheduleData.filter(session => session.day === selectedDay);
    }
    
    if (filteredData.length === 0) {
        scheduleContainer.innerHTML = `
            <div class="empty-state">
                <h3>No sessions found</h3>
                <p>No sessions scheduled for the selected day.</p>
            </div>
        `;
        return;
    }
    
    // Group sessions by day
    const groupedByDay = groupSessionsByDay(filteredData);
    
    // Render day cards
    scheduleContainer.innerHTML = '';
    
    // Order days properly
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const sortedDays = Object.keys(groupedByDay).sort((a, b) => {
        return dayOrder.indexOf(a) - dayOrder.indexOf(b);
    });
    
    sortedDays.forEach(day => {
        const dayCard = createDayCard(day, groupedByDay[day]);
        scheduleContainer.appendChild(dayCard);
    });
}

// Group sessions by day
function groupSessionsByDay(sessions) {
    const grouped = {};
    sessions.forEach(session => {
        if (!grouped[session.day]) {
            grouped[session.day] = [];
        }
        grouped[session.day].push(session);
    });
    
    // Sort sessions within each day by start time
    Object.keys(grouped).forEach(day => {
        grouped[day].sort((a, b) => a.start.localeCompare(b.start));
    });
    
    return grouped;
}

// Create day card element
function createDayCard(day, sessions) {
    const dayCard = document.createElement('div');
    dayCard.className = 'day-card';
    
    const dayHeader = document.createElement('h3');
    dayHeader.textContent = day;
    dayCard.appendChild(dayHeader);
    
    sessions.forEach(session => {
        const sessionElement = createSessionElement(session);
        dayCard.appendChild(sessionElement);
    });
    
    return dayCard;
}

// Create session element
function createSessionElement(session) {
    const sessionDiv = document.createElement('div');
    sessionDiv.className = 'session';
    
    sessionDiv.innerHTML = `
        <div class="session-time">${session.start} - ${session.end}</div>
        <div class="session-course">${escapeHtml(session.course)}</div>
        <div class="session-location">${escapeHtml(session.location)}</div>
    `;
    
    return sessionDiv;
}

// Handle todo form submission
function handleTodoSubmit() {
    if (!todoDate || !todoTime || !todoContent) {
        console.error('Todo form elements not found');
        return;
    }
    
    const date = todoDate.value.trim();
    const time = todoTime.value.trim();
    const content = todoContent.value.trim();
    
    // Validate inputs
    if (!date || !time || !content) {
        alert('Please fill in all fields');
        return;
    }
    
    // Create todo object
    const todo = {
        id: todoIdCounter++,
        date: date,
        time: time,
        content: content,
        datetime: new Date(`${date}T${time}`)
    };
    
    // Add to todos array
    todos.push(todo);
    sortTodos();
    renderTodos();
    
    // Reset form fields
    todoContent.value = '';
    todoTime.value = '';
    
    // Success feedback
    console.log('Todo added successfully:', todo);
}

// Sort todos by date and time
function sortTodos() {
    todos.sort((a, b) => a.datetime - b.datetime);
}

// Render todos
function renderTodos() {
    if (!todoList) return;
    
    if (todos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks yet</h3>
                <p>Add your first task using the form above.</p>
            </div>
        `;
        return;
    }
    
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        todoList.appendChild(todoElement);
    });
}

// Create todo element
function createTodoElement(todo) {
    const todoDiv = document.createElement('div');
    todoDiv.className = 'todo-item';
    
    const formattedDate = formatDate(todo.date);
    const formattedTime = formatTime(todo.time);
    
    todoDiv.innerHTML = `
        <div class="todo-content">
            <div class="todo-datetime">${formattedDate} at ${formattedTime}</div>
            <div class="todo-text">${escapeHtml(todo.content)}</div>
        </div>
        <div class="todo-actions">
            <button class="btn btn--danger btn--small" onclick="deleteTodo(${todo.id})" type="button">
                Delete
            </button>
        </div>
    `;
    
    return todoDiv;
}

// Delete todo - make it globally accessible
window.deleteTodo = function(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
    console.log('Todo deleted, remaining todos:', todos.length);
};

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Reset time part for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) {
        return 'Today';
    } else if (date.getTime() === tomorrow.getTime()) {
        return 'Tomorrow';
    } else {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }
}

// Format time for display
function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}