    'use strict'
    import { Modal } from './components/modal.js';
    import {Dashboard} from './menu/dashboard.js';


    let tasks = Database.getTasksFromDb();
    let lists = Database.getListsFromDb();
    let tags = Database.getTagsFromDb();

    const dashboard = new Dashboard();
    dashboard.adjustDashboard(tasks);
    let activeListView = new ListView("Today",dashboard.todayTasks);
    let activeTaskView = new TaskView(dashboard.todayTasks[0]);

    const listModal = new Modal('list');
    const tagModal = new Modal('tag');


    const createSubtaskBtn = document.getElementById('add-subtask');
    const deleteTaskBtn = document.getElementById('delete-task');
    const saveTaskBtn = document.getElementById('save-task');
    const searchInput = document.getElementById('search');
    const themeToggle = document.getElementById("theme-toggle-checkbox");

    //adjust theme
    const darkMode = Database.getTheme().darkMode
    themeToggle.checked = darkMode
    UI.changeTheme(darkMode);

    // adjust lists and tasks 
    UI.adjustFilters(lists, tags, tasks);

    // render menu 
    UI.renderMenu(lists, tags,dashboard);

    //render default listview and taskview
    UI.renderDashboardPage("Today",dashboard);
    if(dashboard.todayTasks.length > 0){
        const taskTitle = dashboard.todayTasks[0].getTaskInfo().title;
    activeTaskView = UI.openTaskView(tags,lists,tasks,taskTitle);
    }


    // create new list && tag
    document.body.addEventListener('click', function (event) {
        try {
            switch (event.target.id) {
                case 'generate-list':
                    UI.createList(lists, listModal.onSubmit());
                    break;
                case 'generate-tag':
                    UI.createTag(tags, tagModal.onSubmit());
                    break;
                case 'create-list':
                    listModal.openModal();
                    break;
                case 'create-tag':
                    tagModal.openModal();
                    break
                // create new task
                case 'add-task':
                    const taskInput = document.getElementById('task-input').value;
                    try {
                        if (taskInput.trim().length > 0) {
                            UI.createTask(taskInput, activeListView, tasks, lists, tags);
                            dashboard.adjustDashboard(tasks);
                        } else {
                            throw new Error("Please type a task!");
                        }
                    } catch (e) {
                        console.error(e);
                    }
                    break;
                case 'append-tag':
                    const selectedTag = document.getElementById('tag-select').value;
                    UI.addTagToTask(tasks, tags, selectedTag, activeTaskView, { tags, lists });
                case 'add-tag':
                    const popup = document.querySelector('.popup-container');
                    popup.style.display = "flex";
            
                    const tagSelectBox = document.getElementById('tag-select');
                    tagSelectBox.innerHTML = '';
                    for (let tag of tags) {
                        tagSelectBox.innerHTML += `
                        <option value="${tag.getTitle()}">${tag.getTitle()}</option>
                        `
                    }
                    break;
                default:
                    break;
            }
        } catch (e) {
            console.error(e);
        }

        // change list view && change task view
        if (event.target.classList.contains('btn-menu')) {
            const isDashboardAction = event.target.name === "dashboard"
            if(!isDashboardAction){
                const list = event.target.textContent.split(" ")[0];
                activeListView = UI.changePage(lists, list,tasks,"lists");
            }else{
                const actionName = event.target.textContent.split(" ")[0];
                activeListView = UI.renderDashboardPage(actionName,dashboard);
            }

        } else if (event.target.classList.contains('btn-tag')) {
            const tag = event.target.textContent;
            activeListView = UI.changePage(tags, tag,tasks,"tag");
        }
        else if (event.target.classList.contains('inspect-task')) {
            const task = event.target.firstElementChild.textContent;
            activeTaskView = UI.openTaskView(tags, lists, tasks, task);
        }
        else if(event.target.classList.contains('check-task')){
            const checked = event.target.checked;
            const task = event.target.parentNode.nextElementSibling.firstElementChild.textContent;
            UI.checkTask(tasks,task,checked)
        }
        else if(event.target.classList.contains('check-subtask')){
            const checked = event.target.checked;
            const subtask = event.target.nextElementSibling.textContent;
            const task = activeTaskView.getTaskItems().title;
        
            UI.checkSubtask(tasks,task,subtask,checked)
        }
    });

    document.querySelector('.close-button').addEventListener('click', () => {
        listModal.closeModal();
    })
    document.getElementById('close-btn').addEventListener('click', (e) => {
        e.preventDefault();
        const popup = document.querySelector('.popup-container');
        popup.style.display = "none";
    })



    // create new subtask
    createSubtaskBtn.addEventListener('click', () => {
        const subtaskInput = document.getElementById('subtask-input').value;
        try {
            if (subtaskInput.trim().length < 1) throw new Error('Please type a subtask!');
            UI.createSubtask(tasks, activeTaskView, subtaskInput, { tags, lists });
        } catch (e) {
            console.error(e);
        }

    })

    // update task
    saveTaskBtn.addEventListener('click', () => {
        const taskTitleInput = document.querySelector(".task-title");
        const taskDescriptionInput = document.getElementById("task-description");
        const dateTimeInput = document.getElementById("task-date");
        const listsInput = document.getElementById('task-lists');
        const titleInput = taskTitleInput.value || null;
        const descriptionInput = taskDescriptionInput.value || null;
        const dateInput = dateTimeInput.value || null;
        const selectedList = listsInput.value || null;

    [tasks,tags] = UI.updateTask(tags, tasks, activeTaskView, { titleInput, descriptionInput, dateInput, selectedList });
    
    })

    // delete task 
    deleteTaskBtn.addEventListener('click', () => {
        //remove selected task
        const taskToRemove = activeTaskView.getTaskItems().title;
        tasks = UI.removeTask(tasks,taskToRemove);
        UI.openTaskView(tags,lists,tasks,tasks[0].getTaskTitle());
        
        const list = activeListView.getListName();
        const newTasks =[...tasks.filter(task => task.getTaskInfo().list === list).map(task=>{
            return task.getTaskTitle();
        })];

        if(!isDashboardActive()){
            activeListView = new ListView(list,newTasks);
            UI.renderManagerPage(activeListView,tasks);
        }else{
            dashboard.adjustDashboard(tasks);
        UI.renderDashboardPage(activeListView.getListName(),dashboard);
        }
    })


    const isDashboardActive = ()=>{
        const pageTitle = activeListView.getListName();

        return pageTitle === "Today" || pageTitle === "Upcoming" ||
        pageTitle === "Due" || pageTitle === "Pending" || pageTitle ==="Completed"
    }

    searchInput.addEventListener('input',(e)=>{
        const query = e.target.value;
        const results = tasks.filter(task => task.getTaskTitle().includes(query));
        UI.renderSearchResults(query,results);
    })




    themeToggle.addEventListener("change", function(e) {
    // your code here
    const darkMode = e.target.checked
    UI.changeTheme(darkMode);
    });