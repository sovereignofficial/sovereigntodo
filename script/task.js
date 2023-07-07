class Task{
    constructor(task,list,description,date,tags,subtask,completed){
        this._task = task;
        this._description = description ?? null;
        this._list = list;
        this._date = date ?? null;
        this._tags = tags ?? [];
        this._subtasks = subtask ?? [];
        this._completed = completed ?? false;
    }
    getTaskTitle(){
        return this._task;
    }
    getTaskInfo(){
        return {title:this._task,
            description:this._description,
            list:this._list,
            date:this._date,
            tags:this._tags,
            subtasks:this._subtasks,
            completed:this._completed}
    }
    appendSubtask(newSubtask){
      this._subtasks.push(newSubtask);
    }
    appendTag(tag){
        this._tags.push(tag);
    }
    checkTask(checked){
        this._completed = checked;
    }
    checkSubtasks(subtask,checked){
        this._subtasks.find(item=>item.subtask === subtask).completed = checked;
    }
}