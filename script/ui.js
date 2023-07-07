class UI {
static changeTheme(darkMode) {
  const html = document.querySelector("html");
  if (darkMode) {
    html.classList.add("dark-mode");
  } else {
    html.classList.remove("dark-mode");
  }
  Database.saveTheme(darkMode);
}
  static adjustFilters(lists, tags, tasks) {
    for (let task of tasks) {
      console.log(task.getTaskTitle());
      console.log(task.getTaskInfo().tags);
      lists.forEach(list => {
        if (list.getTitle() === task.getTaskInfo().list && !list.getTasks().includes(task.getTaskTitle())) {
          list.appendItemIntoTasks(task.getTaskTitle());
        }
      });
      tags.forEach(tag => {
        if (task.getTaskInfo().tags.find(item=> item._name === tag.getTitle()) && !tag.getTasks().includes(task.getTaskTitle())) {
          tag.appendItemIntoTasks(task.getTaskTitle());
        }
      })
    }
  }
  static createTask(input, page, tasks, lists, tags) {
    const pageTitle = page.getListName();
    const pageMode = page.getListViewMode();
    const tag = pageMode === "tag" && tags.find(item => item.getTitle() === pageTitle);

     console.log("PAGE NAME",pageTitle);
    const newTask = pageMode === "lists"
    ?new Task(input, pageTitle)
    : new Task(input,null,null,null,[tag]);

    tasks.push(newTask);
    Database.saveTasksIntoDb(tasks);
    this.adjustFilters(lists, tags, [newTask]);
    this.renderManagerPage(page, tasks);
    this.openTaskView(tags,lists,tasks,newTask);
  }
  static createSubtask(tasks, taskView, subtask, filters) {
    const taskTitle = taskView.getTaskItems().title;
    const task = tasks.find(item => item.getTaskTitle() === taskTitle);
    task.appendSubtask({ subtask, completed: false });
    const newTaskView = new TaskView(task.getTaskInfo());
    console.log("new taskview", newTaskView);
    this.renderTaskView(newTaskView.getTaskItems(), filters);

  }
  static addTagToTask(tasks, tags, selectedTag, taskView, filters) {

    console.log("is it underscored",taskView.getTaskItems());
    const taskTitle = taskView.getTaskItems().title;
    const task = tasks.find(item => item.getTaskTitle() === taskTitle);
    const foundTag = tags.find(item => item.getTitle() === selectedTag);
    task.appendTag(foundTag);
    const newTaskView = new TaskView(task.getTaskInfo());
    console.log("new taskview", newTaskView.getTaskItems(), filters);
    this.renderTaskView(newTaskView.getTaskItems(), filters);
  }
  static updateTask(tags, tasks, taskView, { titleInput, descriptionInput, dateInput, selectedList }) {
    console.log(tasks, taskView);
    const taskInfo = taskView.getTaskItems();
    const newTasks = tasks.filter(task => task.getTaskTitle() !== taskInfo.title);
    const newTask = new Task(
      titleInput ?? taskInfo.title,
      selectedList ?? taskInfo.list,
      descriptionInput ?? taskInfo.description,
      dateInput ?? taskInfo.date, taskInfo.tags, taskInfo.subtasks, taskInfo.completed);

    newTasks.push(newTask);

    taskInfo.tags.forEach(tag => {
      tags.find(item => item.getTitle() === tag._name).appendItemIntoTasks(newTask.getTaskTitle());
    })
    Database.saveTasksIntoDb(newTasks);
    Database.saveTagsIntoDb(tags);
    return [newTasks, tags];
  }
  static removeTask(tasks, taskToRemove) {
    //create a new array that doesn't include indicated task
    const newTasks = tasks.filter(task => task.getTaskTitle() !== taskToRemove)
    //save new array to ls and return new array to update initial tasks array
    Database.saveTasksIntoDb(newTasks);
    return newTasks;
  }
  static checkTask(tasks, task, checked) {
    const foundTask = tasks.find(item => item.getTaskTitle() === task);
    foundTask.checkTask(checked);
    console.log(tasks);
    Database.saveTasksIntoDb(tasks);
  }
  static checkSubtask(tasks, task, subtask, checked) {
    const foundTask = tasks.find(item => item.getTaskTitle() === task);
    console.log(foundTask);
    foundTask.checkSubtasks(subtask, checked);
    Database.saveTasksIntoDb(tasks);
  }
  static createList(lists, newList) {
    lists.push(newList);
    Database.saveListsIntoDb(lists);
    this.renderLists(lists);
  }
  static createTag(tags, newTag) {
    tags.push(newTag);
    Database.saveTagsIntoDb(tags);
    this.renderTags(tags);}
  static changePage(items, item, tasks , mode) {
    // create a listview and assign the clicked list and find the tasks belongs to that list 
    const foundObject = items.find(obj => obj.getTitle() === item);
    console.log(foundObject);
    const page = new ListView(foundObject.getTitle(), foundObject.getTasks(),mode);
    this.renderManagerPage(page, tasks);
    return page;
  }
  static openTaskView(tags, lists, tasks, task) {
    const foundTask = tasks.find(obj => obj.getTaskTitle() === task) ?? task;
    const taskInfo = foundTask.getTaskInfo()
    const taskView = new TaskView(taskInfo);
    this.renderTaskView(taskView.getTaskItems(), { tags, lists })
    return taskView
  }
  static renderLists(lists) {
    lists.reverse();
    const listContainer = document.getElementById('lists');
    listContainer.innerHTML = `
        <div class="menu-part-header">
        <h4>LISTS</h4>
      </div>
        <li><button id="create-list" class="btn-menu" type="button">+ Add New List </button></li>
        `;
    for (let list of lists) {
      listContainer.innerHTML += `
          <li><button class="btn-menu" type="button">${list?._name} <span>${list?._tasks.length}</span></button></li>
            `
    }
  }
  static renderTags(tags) {
    tags.reverse();
    const tagContainer = document.getElementById('tags');
    tagContainer.innerHTML = `
        <div class="menu-part-header">
        <h4>TAGS</h4>
      </div>
      <li><button id="create-tag" class="btn-add-tag" type="button">+ Add Tag </button></li>
        `;
    for (let tag of tags) {
      tagContainer.innerHTML += `
          <li><button class="btn-tag" type="button">${tag._name}</button></li>
            `
      const tagBtns = document.querySelectorAll('.btn-tag');
      for (let btn of tagBtns) {
        if (btn.textContent === tag._name) {
          btn.style.backgroundColor = tag._bg;
        }
      }
    }
  }
  static renderDashboardActions(dashboard) {
    console.log("sadsa", dashboard)
    const { todayTasks, upcomingTasks, dueTasks, pendingTasks, completedTasks } = dashboard.getDashboardInfo();
    const dahsboardContainer = document.getElementById('tasks');
    dahsboardContainer.innerHTML = `
      <div class="menu-part-header">
      <h4>TASKS</h4>
    </div>
    <li><button class="btn-menu" name="dashboard" type="button">Upcoming <span>${upcomingTasks.length}</span></button></li>
    <li><button class="btn-menu" name="dashboard" type="button">Today <span>${todayTasks.length}</span>  </button></li>
    <li><button class="btn-menu" name="dashboard" type="button">Due <span>${dueTasks.length}</span> </button></li>
    <li><button class="btn-menu" name="dashboard" type="button">Pending <span>${pendingTasks.length}</span> </button></li>
    <li><button class="btn-menu" name="dashboard" type="button">Completed <span>${completedTasks.length}</span> </button></li>
      `
  }
  static renderMenu(lists, tags, dashboard) {
    this.renderDashboardActions(dashboard);
    this.renderLists(lists);
    this.renderTags(tags);
  }
  static renderDashboardPage(actionName, dashboard) {
    let list = [];
    let pageTitle = actionName ?? 'today';
    const listView = document.getElementById('list-info');
    switch (pageTitle) {
      case 'Today':
        list = dashboard.getDashboardInfo().todayTasks;
        break;
      case 'Upcoming':
        list = dashboard.getDashboardInfo().upcomingTasks;
        break;
      case 'Due':
        list = dashboard.getDashboardInfo().dueTasks;
        break;
      case 'Pending':
        list = dashboard.getDashboardInfo().pendingTasks;
        break;
      case 'Completed':
        list = dashboard.getDashboardInfo().completedTasks;
        break;
      default:
        list = dashboard.getDashboardInfo().todayTasks
        break;
    }

    listView.innerHTML = '';
    listView.innerHTML = `
        <div id="list-header">
        <h1>${pageTitle}</h1> <span>${list.length}</span>
      </div>
      <div id="list-body">
        <ul id="task-container">
        </ul>
      </div>
      <div id="list-footer"><h4>Made with ❤️ by Egemen Akdan</h4></div>

        `;
    const listBody = document.getElementById('task-container');

if (list.length < 1) {
  listBody.innerHTML = `
    <h3>Welcome to the Task Manager</h3>
    <p>To get started, create a new list or tag by clicking the "Add New List" or "Add New Tag" button.</p>
    <p>Once you've created a list or tag, you can add tasks to it by clicking the "+" button.</p>
  `;
}
     
    for (let task of list) {
      listBody.innerHTML += `
                <li class="li-task">
                <label class="custom-checkbox"> 
                  <input class="check-task" ${task.getTaskInfo().completed ? "checked" : ""} type="checkbox">
                  <span class="checkbox-styling"></span>
                </label>
                <button type="button" class="inspect-task">
                  <span>${task.getTaskTitle()}</span>
                  <span id="inspect">></span>
                </button>
              </li>`; 
    }

    const page = new ListView(pageTitle, list);
    return page;
  }
  static renderManagerPage(page, taskList) {
    console.log("Page View", page);
    const title = page.getListName();
    const tasks = page.getTasks();
    const listView = document.getElementById('list-info');
    listView.innerHTML = '';
    listView.innerHTML = `
        <div id="list-header">
        <h1>${title}</h1> <span>${tasks.length}</span>
      </div>
      <div id="list-body">
        <div id="task-inputs">
          <button id="add-task" type="button">+</button>
          <input type="text" maxlength="60" id="task-input" placeholder="Add New Task" />
        </div>
        <ul id="task-container">
        </ul>
      </div>
      <div id="list-footer"><h4>Made with ❤️ by Egemen Akdan</h4></div>

        `

    const listBody = document.getElementById('task-container');

    for (let task of tasks) {
      const foundTask = taskList.find(item => item.getTaskTitle() === task);

      listBody.innerHTML += `
            <li class="li-task">
            <label class="custom-checkbox"> 
              <input class="check-task" ${foundTask.getTaskInfo().completed ? "checked" : ""} type="checkbox">
              <span class="checkbox-styling"></span>
            </label>
            <button type="button" class="inspect-task">
              <span>${task}</span>
              <span id="inspect">></span>
            </button>
          </li>
            `
    }
  }
  static renderSearchResults(query,results){
    const listView = document.getElementById('list-info');
    listView.innerHTML = '';
    listView.innerHTML = `
        <div id="list-header">
        <h1>${query}</h1> <span>${results.length}</span>
      </div>
      <div id="list-body">
        <ul id="task-container">
        </ul>
      </div>
      <div id="list-footer"><h4>Made with ❤️ by Egemen Akdan</h4></div>
        `

    const listBody = document.getElementById('task-container');

    for (let task of results) {
      listBody.innerHTML += `
            <li class="li-task">
            <label class="custom-checkbox"> 
              <input class="check-task" ${task.getTaskInfo().completed ? "checked" : ""} type="checkbox">
              <span class="checkbox-styling"></span>
            </label>
            <button type="button" class="inspect-task">
              <span>${task.getTaskTitle()} <span>
              <span id="inspect">></span>
            </button>
          </li>
            `
    }
  }
  static renderTaskView(taskInfo, filters) {
    const { title, description, list, date, tags, subtasks } = taskInfo;
    console.log(subtasks);
    const taskTitle = document.querySelector('.task-title');
    const taskDesc = document.getElementById('task-description');
    const listOptions = document.getElementById('task-lists');
    const tagContainer = document.getElementById('tag-container');
    const dateInput = document.getElementById('task-date');
    const subtaskContainer = document.getElementById('subtask-container');

    taskTitle.setAttribute('placeholder', title);
    taskDesc.setAttribute('placeholder', description ?? "Description");

    listOptions.innerHTML = '';
    const option = document.createElement('option');
    option.innerText = 'Select a Tag';
    listOptions.appendChild(option);
    filters.lists.forEach(item => {
      listOptions.innerHTML += `
           <option value="${item.getTitle()}" ${list === item.getTitle() ? 'selected' : ''}>${item.getTitle()}</option>
           `
    })

    dateInput.value = date;


    tagContainer.innerHTML = ''
    tags.forEach(item => {
      const tag = new Tag(item._name,item._bg,item._tasks);
      const tagInfo = document.createElement('div');
      tagInfo.classList.add('tag-info');
      tagInfo.textContent = tag.getTitle();
      tagInfo.style.backgroundColor = tag.getBgColor();
      tagContainer.appendChild(tagInfo);
    })

    subtaskContainer.innerHTML = ''
    subtasks.forEach(({ subtask, completed }) => {
      subtaskContainer.innerHTML += `
            <li class="li-subtask">
            <input class="check-subtask" ${completed ? "checked" : ""} type="checkbox" />
            <span class="subtask">${subtask}</span>
           </li>
            `
    })

  }
}