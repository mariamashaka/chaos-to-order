// Календарь
let currentDate = new Date();
let events = JSON.parse(localStorage.getItem('events') || '{}');

function initCalendar() {
    updateCalendarDisplay();
    setupCalendarEvents();
}

function updateCalendarDisplay() {
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    const currentMonthElement = document.getElementById('current-month');
    if (currentMonthElement) {
        currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    
    generateCalendarDays();
}

function generateCalendarDays() {
    const calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) return;
    
    calendarDays.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Первый день месяца
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Начинаем с понедельника (1 = понедельник)
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(firstDay.getDate() - mondayOffset);
    
    // Генерируем 42 дня (6 недель)
    for (let i = 0; i < 42; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        
        const dayElement = createDayElement(day, month);
        calendarDays.appendChild(dayElement);
    }
}

function createDayElement(date, currentMonth) {
    const dayDiv = document.createElement('div');
    const isCurrentMonth = date.getMonth() === currentMonth;
    const isToday = isDateToday(date);
    const dateStr = formatDate(date);
    
    dayDiv.className = `min-h-24 p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
        !isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''
    } ${isToday ? 'bg-blue-100 border-blue-300' : ''}`;
    
    // Создаем содержимое дня
    let eventsHtml = '';
    if (events[dateStr]) {
        events[dateStr].forEach(event => {
            const timeStr = event.time ? `${event.time} ` : '';
            eventsHtml += `
                <div class="text-xs bg-blue-500 text-white px-1 py-0.5 rounded mb-1 truncate">
                    ${timeStr}${event.title}
                </div>
            `;
        });
    }
    
    dayDiv.innerHTML = `
        <div class="font-bold text-sm">${date.getDate()}</div>
        <div class="events-container">${eventsHtml}</div>
    `;
    
    dayDiv.onclick = () => openEventModal(date);
    
    return dayDiv;
}

function isDateToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function setupCalendarEvents() {
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    
    if (prevBtn) {
        prevBtn.onclick = () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendarDisplay();
        };
    }
    
    if (nextBtn) {
        nextBtn.onclick = () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendarDisplay();
        };
    }
}

function openEventModal(date) {
    console.log('Открытие модального окна для даты:', date);
    // Пока просто лог, модальное окно добавим в следующем шаге
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initCalendar);
