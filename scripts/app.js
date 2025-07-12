// ============================================
// CHAOS TO ORDER - ОСНОВНАЯ ЛОГИКА
// ============================================

// Глобальные переменные для хранения данных
let appData = {
    categories: ['Поликлиника', 'Администрация', 'Персонал', 'Фармация', 'Страхование', 'Пациенты', 'Семья', 'Дети', 'Здоровье', 'Личное развитие', 'Дом', 'Финансы', 'Прочее'],
    yearlyGoals: {},
    quarterlyTasks: {},
    chaosTasks: [],
    weeklyPlans: {},
    dailyPlan: [],
    cyclicTasks: [
        { title: 'Формировать ордер фармации', category: 'Фармация', dayOfMonth: 20 },
        { title: 'Писать шифты MD', category: 'Персонал', dayOfMonth: 24 },
        { title: 'Писать шифты специалистов', category: 'Персонал', dayOfMonth: 1 },
        { title: 'Проверять страховые', category: 'Страхование', dayOfMonth: 10 }
    ],
    currentQuarter: 1,
    currentWeek: 1
};

// ============================================
// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Chaos to Order загружается...');
    loadData();
    initializeCategories();
    showView('chaos');
    renderChaosView();
});

// ============================================
// УПРАВЛЕНИЕ ДАННЫМИ
// ============================================
function saveData() {
    try {
        localStorage.setItem('chaosToOrderData', JSON.stringify(appData));
        console.log('💾 Данные сохранены');
    } catch (error) {
        console.error('❌ Ошибка сохранения:', error);
    }
}

function loadData() {
    try {
        const saved = localStorage.getItem('chaosToOrderData');
        if (saved) {
            const loadedData = JSON.parse(saved);
            appData = { ...appData, ...loadedData };
            console.log('📂 Данные загружены');
        }
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
    }
}

// ============================================
// УПРАВЛЕНИЕ ВИДАМИ
// ============================================
function showView(viewName) {
    // Скрываем все виды
    document.querySelectorAll('.view-container').forEach(view => {
        view.classList.add('hidden');
    });
    
    // Убираем активный класс с кнопок
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('ring-4', 'ring-white');
    });
    
    // Показываем нужный вид
    const targetView = document.getElementById(viewName + '-view');
    if (targetView) {
        targetView.classList.remove('hidden');
    }
    
    // Подсвечиваем активную кнопку
    const activeBtn = document.getElementById('nav-' + viewName);
    if (activeBtn) {
        activeBtn.classList.add('ring-4', 'ring-white');
    }
    
    // Рендерим соответствующий контент
    switch(viewName) {
        case 'strategic':
            renderStrategicView();
            break;
        case 'chaos':
            renderChaosView();
            break;
        case 'weekly':
            renderWeeklyView();
            break;
        case 'daily':
            renderDailyView();
            break;
        case 'settings':
            renderSettingsView();
            break;
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ КАТЕГОРИЙ
// ============================================
function initializeCategories() {
    const categorySelect = document.getElementById('new-task-category');
    if (categorySelect) {
        categorySelect.innerHTML = '<option value="">Выберите категорию</option>';
        appData.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
}

// ============================================
// ХАОС-ЗОНА
// ============================================
function addChaosTask() {
    const title = document.getElementById('new-task-title').value.trim();
    const category = document.getElementById('new-task-category').value;
    const priority = document.getElementById('new-task-priority').value;
    
    if (!title) {
        alert('⚠️ Введите название задачи!');
        return;
    }
    
    if (!category) {
        alert('⚠️ Выберите категорию!');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        title: title,
        category: category,
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString(),
        estimatedTime: '15min' // По умолчанию
    };
    
    appData.chaosTasks.push(newTask);
    saveData();
    
    // Очищаем форму
    document.getElementById('new-task-title').value = '';
    document.getElementById('new-task-category').value = '';
    document.getElementById('new-task-priority').value = 'medium';
    
    renderChaosView();
    console.log('✅ Задача добавлена в хаос:', newTask.title);
}

function renderChaosView() {
    const container = document.getElementById('chaos-tasks');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (appData.chaosTasks.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500">
                <i class="fas fa-inbox text-4xl mb-4"></i>
                <p>Хаос пуст! Добавьте первую задачу.</p>
            </div>
        `;
        return;
    }
    
    appData.chaosTasks.forEach(task => {
        const taskCard = createTaskCard(task, 'chaos');
        container.appendChild(taskCard);
    });
}

function createTaskCard(task, source = 'chaos') {
    const card = document.createElement('div');
    card.className = `bg-white rounded-lg p-4 shadow border-l-4 priority-${task.priority}`;
    
    const priorityIcons = {
        urgent: '🔥',
        high: '⚡',
        medium: '📋',
        low: '💤'
    };
    
    const priorityLabels = {
        urgent: 'Срочно',
        high: 'Высокий',
        medium: 'Средний',
        low: 'Низкий'
    };
    
    card.innerHTML = `
        <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
                <h3 class="font-medium text-gray-800 mb-1">${task.title}</h3>
                <div class="text-sm text-gray-600">
                    <span class="inline-block bg-gray-100 px-2 py-1 rounded mr-2">
                        ${task.category}
                    </span>
                    <span class="inline-block">
                        ${priorityIcons[task.priority]} ${priorityLabels[task.priority]}
                    </span>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="toggleTaskComplete(${task.id}, '${source}')" 
                        class="w-6 h-6 rounded border-2 ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'} 
                               flex items-center justify-center hover:border-green-400">
                    ${task.completed ? '<i class="fas fa-check text-white text-xs"></i>' : ''}
                </button>
                <button onclick="editTask(${task.id})" class="text-gray-400 hover:text-blue-500">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteTask(${task.id}, '${source}')" class="text-gray-400 hover:text-red-500">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        
        ${source === 'chaos' ? `
        <div class="flex space-x-2">
            <select onchange="moveToWeek(${task.id}, this.value)" class="text-sm p-2 border rounded flex-1">
                <option value="">➡️ В неделю</option>
                <option value="1">Неделя 1</option>
                <option value="2">Неделя 2</option>
                <option value="3">Неделя 3</option>
                <option value="4">Неделя 4</option>
            </select>
        </div>
        ` : ''}
    `;
    
    return card;
}

// ============================================
// ОПЕРАЦИИ С ЗАДАЧАМИ
// ============================================
function toggleTaskComplete(taskId, source) {
    if (source === 'chaos') {
        const task = appData.chaosTasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveData();
            renderChaosView();
        }
    }
    // Добавим для других источников позже
}

function editTask(taskId) {
    // Пока простая реализация
    const task = appData.chaosTasks.find(t => t.id === taskId);
    if (task) {
        const newTitle = prompt('Изменить название задачи:', task.title);
        if (newTitle && newTitle.trim()) {
            task.title = newTitle.trim();
            saveData();
            renderChaosView();
        }
    }
}

function deleteTask(taskId, source) {
    if (confirm('Удалить задачу?')) {
        if (source === 'chaos') {
            appData.chaosTasks = appData.chaosTasks.filter(t => t.id !== taskId);
            saveData();
            renderChaosView();
        }
    }
}

function moveToWeek(taskId, weekNumber) {
    if (!weekNumber) return;
    
    const task = appData.chaosTasks.find(t => t.id === taskId);
    if (task) {
        // Инициализируем недельный план если его нет
        if (!appData.weeklyPlans[weekNumber]) {
            appData.weeklyPlans[weekNumber] = [];
        }
        
        // Добавляем в недельный план
        appData.weeklyPlans[weekNumber].push({...task, movedAt: new Date().toISOString()});
        
        // Убираем из хаоса
        appData.chaosTasks = appData.chaosTasks.filter(t => t.id !== taskId);
        
        saveData();
        renderChaosView();
        
        console.log(`📅 Задача "${task.title}" перемещена в неделю ${weekNumber}`);
    }
}

// ============================================
// ФИЛЬТРАЦИЯ ХАОСА
// ============================================
function filterChaos(filterType) {
    // Убираем активный класс со всех кнопок фильтра
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-white');
    });
    
    // Подсвечиваем активный фильтр
    event.target.classList.add('ring-2', 'ring-white');
    
    const container = document.getElementById('chaos-tasks');
    if (!container) return;
    
    let filteredTasks = [...appData.chaosTasks];
    
    switch(filterType) {
        case 'urgent':
            filteredTasks = filteredTasks.filter(task => task.priority === 'urgent');
            break;
        case 'quick':
            filteredTasks = filteredTasks.filter(task => task.estimatedTime === '5min');
            break;
        case 'all':
        default:
            // Показываем все
            break;
    }
    
    container.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500">
                <i class="fas fa-filter text-4xl mb-4"></i>
                <p>Нет задач в этом фильтре</p>
            </div>
        `;
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskCard = createTaskCard(task, 'chaos');
        container.appendChild(taskCard);
    });
}

// ============================================
// ЗАГЛУШКИ ДЛЯ БУДУЩИХ ФУНКЦИЙ
// ============================================
function renderStrategicView() {
    console.log('📊 Стратегическое планирование (в разработке)');
}

function renderWeeklyView() {
    console.log('📅 Недельное планирование (в разработке)');
}

function renderDailyView() {
    console.log('⏰ Дневное планирование (в разработке)');
}

function renderSettingsView() {
    console.log('⚙️ Настройки (в разработке)');
}

function addYearlyGoal() {
    console.log('🎯 Добавление годовой цели (в разработке)');
}

function loadQuarter() {
    console.log('📈 Загрузка квартала (в разработке)');
}

function reviewQuarter() {
    console.log('📝 Пересмотр квартала (в разработке)');
}

// ============================================
// CSS СТИЛИ ДЛЯ КНОПОК
// ============================================
const style = document.createElement('style');
style.textContent = `
    .nav-btn {
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    
    .nav-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    
    .filter-btn {
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        border: none;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .filter-btn:hover {
        transform: translateY(-1px);
    }
`;
document.head.appendChild(style);

console.log('🎉 Chaos to Order готов к работе!');
