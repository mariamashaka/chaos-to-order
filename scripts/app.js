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
// ============================================
// СТРАТЕГИЧЕСКОЕ ПЛАНИРОВАНИЕ
// ============================================
function renderStrategicView() {
    const strategicView = document.getElementById('strategic-view');
    if (!strategicView) return;
    
    // Инициализируем данные если их нет
    if (!appData.yearlyGoals) appData.yearlyGoals = {};
    if (!appData.quarterlyTasks) appData.quarterlyTasks = {};
    
    strategicView.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Годовое планирование -->
            <div class="bg-white rounded-lg p-6 shadow-lg">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-2xl font-bold text-purple-700">
                        <i class="fas fa-calendar-alt"></i> Годовые цели 2025
                    </h2>
                    <button onclick="showAddGoalModal()" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                        <i class="fas fa-plus"></i> Добавить цель
                    </button>
                </div>
                
                <div id="yearly-goals-list" class="space-y-4">
                    <!-- Цели будут загружены сюда -->
                </div>
                
                ${Object.keys(appData.yearlyGoals).length === 0 ? `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-bullseye text-4xl mb-4"></i>
                        <p>Добавьте первую годовую цель!</p>
                    </div>
                ` : ''}
            </div>
            
            <!-- Квартальное планирование -->
            <div class="bg-white rounded-lg p-6 shadow-lg">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-2xl font-bold text-blue-700">
                        <i class="fas fa-tasks"></i> Квартальные задачи
                    </h2>
                    <div class="flex items-center gap-2">
                        <select id="quarter-selector" onchange="loadQuarter()" class="p-2 border rounded">
                            <option value="1" ${appData.currentQuarter === 1 ? 'selected' : ''}>Q1 2025</option>
                            <option value="2" ${appData.currentQuarter === 2 ? 'selected' : ''}>Q2 2025</option>
                            <option value="3" ${appData.currentQuarter === 3 ? 'selected' : ''}>Q3 2025</option>
                            <option value="4" ${appData.currentQuarter === 4 ? 'selected' : ''}>Q4 2025</option>
                        </select>
                        <button onclick="reviewQuarter()" class="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
                            <i class="fas fa-clipboard-check"></i> Пересмотр
                        </button>
                    </div>
                </div>
                
                <div class="mb-4">
                    <button onclick="showAddQuarterlyTaskModal()" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        <i class="fas fa-plus"></i> Добавить задачу
                    </button>
                </div>
                
                <div id="quarterly-tasks-list" class="space-y-3">
                    <!-- Квартальные задачи будут загружены сюда -->
                </div>
            </div>
        </div>
        
        <!-- История пересмотров -->
        <div class="mt-6 bg-white rounded-lg p-6 shadow-lg">
            <h2 class="text-2xl font-bold text-green-700 mb-4">
                <i class="fas fa-history"></i> История пересмотров
            </h2>
            <div id="reviews-history" class="space-y-2">
                <!-- История будет загружена сюда -->
            </div>
        </div>
    `;
    
    renderYearlyGoals();
    renderQuarterlyTasks();
    renderReviewsHistory();
}

// ============================================
// ГОДОВЫЕ ЦЕЛИ
// ============================================
function renderYearlyGoals() {
    const container = document.getElementById('yearly-goals-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.categories.forEach(category => {
        const goals = appData.yearlyGoals[category] || [];
        
        if (goals.length > 0) {
            const categoryBlock = document.createElement('div');
            categoryBlock.className = 'border-l-4 border-purple-400 pl-4 py-2';
            
            categoryBlock.innerHTML = `
                <h3 class="font-bold text-purple-700 mb-2">${category}</h3>
                <div class="space-y-2">
                    ${goals.map(goal => `
                        <div class="bg-purple-50 p-3 rounded border">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <p class="font-medium">${goal.title}</p>
                                    ${goal.description ? `<p class="text-sm text-gray-600 mt-1">${goal.description}</p>` : ''}
                                </div>
                                <div class="flex items-center gap-2 ml-2">
                                    <button onclick="editYearlyGoal('${category}', ${goal.id})" class="text-blue-500 hover:text-blue-700">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="deleteYearlyGoal('${category}', ${goal.id})" class="text-red-500 hover:text-red-700">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.appendChild(categoryBlock);
        }
    });
}

function showAddGoalModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    modal.id = 'goal-modal';
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 class="text-xl font-bold mb-4">Добавить годовую цель</h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Категория</label>
                    <select id="goal-category" class="w-full p-2 border rounded">
                        ${appData.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Цель</label>
                    <input type="text" id="goal-title" placeholder="Что хотите достичь?" class="w-full p-2 border rounded">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Описание (необязательно)</label>
                    <textarea id="goal-description" placeholder="Подробности..." class="w-full p-2 border rounded" rows="3"></textarea>
                </div>
            </div>
            <div class="flex justify-end gap-2 mt-6">
                <button onclick="closeModal('goal-modal')" class="px-4 py-2 border rounded hover:bg-gray-50">
                    Отмена
                </button>
                <button onclick="addYearlyGoal()" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                    Добавить
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function addYearlyGoal() {
    const category = document.getElementById('goal-category').value;
    const title = document.getElementById('goal-title').value.trim();
    const description = document.getElementById('goal-description').value.trim();
    
    if (!title) {
        alert('⚠️ Введите название цели!');
        return;
    }
    
    if (!appData.yearlyGoals[category]) {
        appData.yearlyGoals[category] = [];
    }
    
    const newGoal = {
        id: Date.now(),
        title: title,
        description: description,
        createdAt: new Date().toISOString()
    };
    
    appData.yearlyGoals[category].push(newGoal);
    saveData();
    
    closeModal('goal-modal');
    renderYearlyGoals();
    
    console.log('🎯 Годовая цель добавлена:', title);
}

function editYearlyGoal(category, goalId) {
    const goals = appData.yearlyGoals[category] || [];
    const goal = goals.find(g => g.id === goalId);
    
    if (!goal) return;
    
    const newTitle = prompt('Изменить цель:', goal.title);
    if (newTitle && newTitle.trim()) {
        goal.title = newTitle.trim();
        saveData();
        renderYearlyGoals();
    }
}

function deleteYearlyGoal(category, goalId) {
    if (!confirm('Удалить годовую цель?')) return;
    
    if (appData.yearlyGoals[category]) {
        appData.yearlyGoals[category] = appData.yearlyGoals[category].filter(g => g.id !== goalId);
        saveData();
        renderYearlyGoals();
    }
}

// ============================================
// КВАРТАЛЬНЫЕ ЗАДАЧИ
// ============================================
function renderQuarterlyTasks() {
    const container = document.getElementById('quarterly-tasks-list');
    if (!container) return;
    
    const currentQuarter = appData.currentQuarter;
    const quarterKey = `q${currentQuarter}_2025`;
    
    if (!appData.quarterlyTasks[quarterKey]) {
        appData.quarterlyTasks[quarterKey] = [];
    }
    
    const tasks = appData.quarterlyTasks[quarterKey];
    container.innerHTML = '';
    
    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-clipboard-list text-4xl mb-4"></i>
                <p>Нет задач на этот квартал</p>
            </div>
        `;
        return;
    }
    
    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = `p-3 rounded border-l-4 ${getStatusClass(task.status)} bg-white`;
        
        taskCard.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h4 class="font-medium">${task.title}</h4>
                    <p class="text-sm text-gray-600">${task.category}</p>
                    ${task.description ? `<p class="text-xs text-gray-500 mt-1">${task.description}</p>` : ''}
                    <div class="mt-2 flex items-center gap-2">
                        <span class="text-xs px-2 py-1 rounded ${getStatusBadge(task.status)}">
                            ${getStatusLabel(task.status)}
                        </span>
                        ${task.status === 'active' ? `
                            <button onclick="moveQuarterlyTaskToWeek(${task.id})" class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                                В неделю
                            </button>
                        ` : ''}
                    </div>
                </div>
                <div class="flex items-center gap-2 ml-2">
                    ${task.status === 'active' ? `
                        <button onclick="editQuarterlyTask(${task.id})" class="text-blue-500 hover:text-blue-700">
                            <i class="fas fa-edit"></i>
                        </button>
                    ` : ''}
                    <button onclick="deleteQuarterlyTask(${task.id})" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(taskCard);
    });
}

function showAddQuarterlyTaskModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    modal.id = 'quarterly-task-modal';
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 class="text-xl font-bold mb-4">Добавить квартальную задачу</h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Категория</label>
                    <select id="qtask-category" class="w-full p-2 border rounded">
                        ${appData.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Задача</label>
                    <input type="text" id="qtask-title" placeholder="Что нужно сделать в этом квартале?" class="w-full p-2 border rounded">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Описание</label>
                    <textarea id="qtask-description" placeholder="Подробности..." class="w-full p-2 border rounded" rows="3"></textarea>
                </div>
            </div>
            <div class="flex justify-end gap-2 mt-6">
                <button onclick="closeModal('quarterly-task-modal')" class="px-4 py-2 border rounded hover:bg-gray-50">
                    Отмена
                </button>
                <button onclick="addQuarterlyTask()" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Добавить
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function addQuarterlyTask() {
    const category = document.getElementById('qtask-category').value;
    const title = document.getElementById('qtask-title').value.trim();
    const description = document.getElementById('qtask-description').value.trim();
    
    if (!title) {
        alert('⚠️ Введите название задачи!');
        return;
    }
    
    const quarterKey = `q${appData.currentQuarter}_2025`;
    
    if (!appData.quarterlyTasks[quarterKey]) {
        appData.quarterlyTasks[quarterKey] = [];
    }
    
    const newTask = {
        id: Date.now(),
        title: title,
        description: description,
        category: category,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    appData.quarterlyTasks[quarterKey].push(newTask);
    saveData();
    
    closeModal('quarterly-task-modal');
    renderQuarterlyTasks();
    
    console.log('📋 Квартальная задача добавлена:', title);
}

function moveQuarterlyTaskToWeek(taskId) {
    const quarterKey = `q${appData.currentQuarter}_2025`;
    const task = appData.quarterlyTasks[quarterKey]?.find(t => t.id === taskId);
    
    if (!task) return;
    
    const weekNumber = prompt('В какую неделю перенести? (1-4)', '1');
    if (!weekNumber || !['1','2','3','4'].includes(weekNumber)) return;
    
    // Создаем копию задачи для недельного плана
    const weeklyTask = {
        ...task,
        id: Date.now(), // Новый ID для недельной версии
        source: 'quarterly',
        originalId: task.id,
        movedAt: new Date().toISOString()
    };
    
    // Добавляем в недельный план
    if (!appData.weeklyPlans[weekNumber]) {
        appData.weeklyPlans[weekNumber] = [];
    }
    
    appData.weeklyPlans[weekNumber].push(weeklyTask);
    saveData();
    
    console.log(`📅 Квартальная задача "${task.title}" перемещена в неделю ${weekNumber}`);
    alert(`✅ Задача перемещена в неделю ${weekNumber}`);
}

// ============================================
// УТИЛИТЫ ДЛЯ СТАТУСОВ
// ============================================
function getStatusClass(status) {
    switch(status) {
        case 'completed': return 'border-green-400';
        case 'transferred': return 'border-yellow-400';
        case 'cancelled': return 'border-red-400';
        default: return 'border-blue-400';
    }
}

function getStatusBadge(status) {
    switch(status) {
        case 'completed': return 'bg-green-100 text-green-800';
        case 'transferred': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-blue-100 text-blue-800';
    }
}

function getStatusLabel(status) {
    switch(status) {
        case 'completed': return '✅ Выполнено';
        case 'transferred': return '🔄 Перенесено';
        case 'cancelled': return '❌ Отменено';
        default: return '🔵 Активно';
    }
}

// ============================================
// ПЕРЕСМОТР КВАРТАЛА
// ============================================
function reviewQuarter() {
    const quarterKey = `q${appData.currentQuarter}_2025`;
    const tasks = appData.quarterlyTasks[quarterKey] || [];
    
    if (tasks.length === 0) {
        alert('В этом квартале нет задач для пересмотра');
        return;
    }
    
    showReviewModal(tasks, quarterKey);
}

function showReviewModal(tasks, quarterKey) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    modal.id = 'review-modal';
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-96 overflow-y-auto">
            <h3 class="text-xl font-bold mb-4">Пересмотр квартала Q${appData.currentQuarter} 2025</h3>
            <div class="space-y-3">
                ${tasks.map(task => `
                    <div class="p-3 border rounded">
                        <h4 class="font-medium">${task.title}</h4>
                        <p class="text-sm text-gray-600">${task.category}</p>
                        <div class="mt-2">
                            <label class="text-sm font-medium">Статус:</label>
                            <select id="review-status-${task.id}" class="ml-2 p-1 border rounded">
                                <option value="completed">✅ Выполнено</option>
                                <option value="transferred">🔄 Перенести в следующий квартал</option>
                                <option value="cancelled">❌ Отменить/неактуально</option>
                            </select>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="flex justify-end gap-2 mt-6">
                <button onclick="closeModal('review-modal')" class="px-4 py-2 border rounded hover:bg-gray-50">
                    Отмена
                </button>
                <button onclick="saveQuarterReview('${quarterKey}')" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Сохранить пересмотр
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function saveQuarterReview(quarterKey) {
    const tasks = appData.quarterlyTasks[quarterKey] || [];
    const reviewResults = [];
    
    tasks.forEach(task => {
        const statusSelect = document.getElementById(`review-status-${task.id}`);
        if (statusSelect) {
            const newStatus = statusSelect.value;
            task.status = newStatus;
            task.reviewedAt = new Date().toISOString();
            
            reviewResults.push({
                taskTitle: task.title,
                category: task.category,
                status: newStatus
            });
            
            // Если переносим в следующий квартал
            if (newStatus === 'transferred') {
                const nextQuarter = appData.currentQuarter === 4 ? 1 : appData.currentQuarter + 1;
                const nextQuarterKey = `q${nextQuarter}_2025`;
                
                if (!appData.quarterlyTasks[nextQuarterKey]) {
                    appData.quarterlyTasks[nextQuarterKey] = [];
                }
                
                const transferredTask = {
                    ...task,
                    id: Date.now() + Math.random(), // Новый ID
                    status: 'active',
                    transferredFrom: quarterKey,
                    createdAt: new Date().toISOString()
                };
                
                appData.quarterlyTasks[nextQuarterKey].push(transferredTask);
            }
        }
    });
    
    // Сохраняем историю пересмотра
    if (!appData.reviewHistory) appData.reviewHistory = [];
    appData.reviewHistory.push({
        quarter: quarterKey,
        reviewDate: new Date().toISOString(),
        results: reviewResults
    });
    
    saveData();
    closeModal('review-modal');
    renderQuarterlyTasks();
    renderReviewsHistory();
    
    console.log('📊 Пересмотр квартала завершен');
}

// ============================================
// ИСТОРИЯ ПЕРЕСМОТРОВ
// ============================================
function renderReviewsHistory() {
    const container = document.getElementById('reviews-history');
    if (!container) return;
    
    if (!appData.reviewHistory || appData.reviewHistory.length === 0) {
        container.innerHTML = '<p class="text-gray-500">История пересмотров пуста</p>';
        return;
    }
    
    container.innerHTML = '';
    
    appData.reviewHistory.slice(-5).reverse().forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'bg-gray-50 p-3 rounded border';
        
        const reviewDate = new Date(review.reviewDate).toLocaleDateString('ru');
        const completed = review.results.filter(r => r.status === 'completed').length;
        const transferred = review.results.filter(r => r.status === 'transferred').length;
        const cancelled = review.results.filter(r => r.status === 'cancelled').length;
        
        reviewCard.innerHTML = `
            <div class="flex items-center justify-between">
                <h4 class="font-medium">${review.quarter.toUpperCase()} - ${reviewDate}</h4>
                <div class="text-sm text-gray-600">
                    <span class="text-green-600">✅ ${completed}</span>
                    <span class="text-yellow-600 ml-2">🔄 ${transferred}</span>
                    <span class="text-red-600 ml-2">❌ ${cancelled}</span>
                </div>
            </div>
        `;
        
        container.appendChild(reviewCard);
    });
}

// ============================================
// УПРАВЛЕНИЕ МОДАЛЬНЫМИ ОКНАМИ
// ============================================
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        document.body.removeChild(modal);
    }
}

// ============================================
// ЗАГРУЗКА КВАРТАЛА
// ============================================
function loadQuarter() {
    const quarterSelect = document.getElementById('quarter-selector');
    if (quarterSelect) {
        appData.currentQuarter = parseInt(quarterSelect.value);
        saveData();
        renderQuarterlyTasks();
    }
}

// Добавляем функции для редактирования и удаления квартальных задач
function editQuarterlyTask(taskId) {
    const quarterKey = `q${appData.currentQuarter}_2025`;
    const task = appData.quarterlyTasks[quarterKey]?.find(t => t.id === taskId);
    
    if (!task) return;
    
    const newTitle = prompt('Изменить задачу:', task.title);
    if (newTitle && newTitle.trim()) {
        task.title = newTitle.trim();
        saveData();
        renderQuarterlyTasks();
    }
}

function deleteQuarterlyTask(taskId) {
    if (!confirm('Удалить квартальную задачу?')) return;
    
    const quarterKey = `q${appData.currentQuarter}_2025`;
    if (appData.quarterlyTasks[quarterKey]) {
        appData.quarterlyTasks[quarterKey] = appData.quarterlyTasks[quarterKey].filter(t => t.id !== taskId);
        saveData();
        renderQuarterlyTasks();
    }
}

function renderWeeklyView() {
    console.log('📅 Недельное планирование (в разработке)');
}

function renderDailyView() {
    console.log('⏰ Дневное планирование (в разработке)');
}

// ============================================
// НАСТРОЙКИ - УПРАВЛЕНИЕ КАТЕГОРИЯМИ
// ============================================
function renderSettingsView() {
    const settingsView = document.getElementById('settings-view');
    if (!settingsView) return;
    
    settingsView.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Управление категориями -->
            <div class="bg-white rounded-lg p-6 shadow-lg">
                <h2 class="text-2xl font-bold mb-4 text-gray-700">
                    <i class="fas fa-tags"></i> Управление категориями
                </h2>
                
                <!-- Добавление новой категории -->
                <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 class="font-medium mb-3">Добавить категорию</h3>
                    <div class="flex gap-2">
                        <input type="text" id="new-category-name" placeholder="Название категории" 
                               class="flex-1 p-2 border rounded">
                        <button onclick="addCategory()" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            <i class="fas fa-plus"></i> Добавить
                        </button>
                    </div>
                </div>
                
                <!-- Список существующих категорий -->
                <div>
                    <h3 class="font-medium mb-3">Существующие категории</h3>
                    <div id="categories-list" class="space-y-2">
                        <!-- Категории будут загружены сюда -->
                    </div>
                </div>
            </div>
            
            <!-- Экспорт данных -->
            <div class="bg-white rounded-lg p-6 shadow-lg">
                <h2 class="text-2xl font-bold mb-4 text-blue-700">
                    <i class="fas fa-download"></i> Экспорт данных
                </h2>
                
                <div class="space-y-4">
                    <button onclick="exportToJSON()" class="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700">
                        <i class="fas fa-file-code"></i> Экспорт в JSON
                    </button>
                    
                    <button onclick="exportToPDF()" class="w-full bg-red-600 text-white px-4 py-3 rounded hover:bg-red-700">
                        <i class="fas fa-file-pdf"></i> Экспорт в PDF (скоро)
                    </button>
                    
                    <div class="mt-4 p-4 bg-yellow-50 rounded border border-yellow-200">
                        <h4 class="font-medium text-yellow-800 mb-2">📊 Статистика</h4>
                        <div class="text-sm text-yellow-700">
                            <p>Всего категорий: <span class="font-bold">${appData.categories.length}</span></p>
                            <p>Задач в хаосе: <span class="font-bold">${appData.chaosTasks.length}</span></p>
                            <p>Завершенных задач: <span class="font-bold">${appData.chaosTasks.filter(t => t.completed).length}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Импорт данных -->
        <div class="mt-6 bg-white rounded-lg p-6 shadow-lg">
            <h2 class="text-2xl font-bold mb-4 text-purple-700">
                <i class="fas fa-upload"></i> Импорт данных
            </h2>
            <div class="flex items-center gap-4">
                <input type="file" id="import-file" accept=".json" class="hidden">
                <button onclick="document.getElementById('import-file').click()" 
                        class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                    <i class="fas fa-file-upload"></i> Выбрать файл JSON
                </button>
                <button onclick="importFromJSON()" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                    <i class="fas fa-upload"></i> Импортировать
                </button>
                <span class="text-sm text-gray-600">Загрузите ранее экспортированные данные</span>
            </div>
        </div>
    `;
    
    renderCategoriesList();
}

function renderCategoriesList() {
    const container = document.getElementById('categories-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.categories.forEach((category, index) => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'flex items-center justify-between p-3 bg-gray-50 rounded border';
        
        // Подсчитываем количество задач в этой категории
        const tasksCount = appData.chaosTasks.filter(task => task.category === category).length;
        
        categoryItem.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="w-4 h-4 bg-blue-500 rounded"></span>
                <span class="font-medium">${category}</span>
                <span class="text-sm text-gray-500">(${tasksCount} задач)</span>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="editCategory(${index})" class="text-blue-500 hover:text-blue-700">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteCategory(${index})" class="text-red-500 hover:text-red-700 ${tasksCount > 0 ? 'opacity-50 cursor-not-allowed' : ''}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        container.appendChild(categoryItem);
    });
}

function addCategory() {
    const nameInput = document.getElementById('new-category-name');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert('⚠️ Введите название категории!');
        return;
    }
    
    if (appData.categories.includes(name)) {
        alert('⚠️ Такая категория уже существует!');
        return;
    }
    
    appData.categories.push(name);
    saveData();
    
    nameInput.value = '';
    renderCategoriesList();
    initializeCategories(); // Обновляем все селекты в приложении
    
    console.log('✅ Категория добавлена:', name);
}

function editCategory(index) {
    const currentName = appData.categories[index];
    const newName = prompt('Изменить название категории:', currentName);
    
    if (!newName || !newName.trim()) return;
    
    const trimmedName = newName.trim();
    
    if (appData.categories.includes(trimmedName) && trimmedName !== currentName) {
        alert('⚠️ Такая категория уже существует!');
        return;
    }
    
    // Обновляем категорию во всех задачах
    appData.chaosTasks.forEach(task => {
        if (task.category === currentName) {
            task.category = trimmedName;
        }
    });
    
    // Обновляем в списке категорий
    appData.categories[index] = trimmedName;
    
    saveData();
    renderCategoriesList();
    initializeCategories();
    renderChaosView(); // Обновляем отображение задач
    
    console.log('✅ Категория изменена:', currentName, '→', trimmedName);
}

function deleteCategory(index) {
    const category = appData.categories[index];
    const tasksCount = appData.chaosTasks.filter(task => task.category === category).length;
    
    if (tasksCount > 0) {
        alert(`⚠️ Нельзя удалить категорию "${category}" - в ней есть ${tasksCount} задач!`);
        return;
    }
    
    if (!confirm(`Удалить категорию "${category}"?`)) return;
    
    appData.categories.splice(index, 1);
    saveData();
    
    renderCategoriesList();
    initializeCategories();
    
    console.log('✅ Категория удалена:', category);
}

// ============================================
// ЭКСПОРТ И ИМПОРТ ДАННЫХ
// ============================================
function exportToJSON() {
    const dataToExport = {
        ...appData,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chaos-to-order-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('📁 Данные экспортированы в JSON');
}

function exportToPDF() {
    alert('📄 Экспорт в PDF будет добавлен в следующей версии!');
}

function importFromJSON() {
    const fileInput = document.getElementById('import-file');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('⚠️ Выберите файл для импорта!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (!confirm('⚠️ Импорт заменит все текущие данные. Продолжить?')) {
                return;
            }
            
            // Проверяем базовую структуру
            if (importedData.categories && Array.isArray(importedData.categories)) {
                appData = { ...appData, ...importedData };
                saveData();
                
                // Обновляем интерфейс
                initializeCategories();
                renderSettingsView();
                renderChaosView();
                
                alert('✅ Данные успешно импортированы!');
                console.log('📥 Данные импортированы');
            } else {
                alert('❌ Неверный формат файла!');
            }
        } catch (error) {
            alert('❌ Ошибка чтения файла!');
            console.error('Ошибка импорта:', error);
        }
    };
    
    reader.readAsText(file);
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
