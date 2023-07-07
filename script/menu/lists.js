class List{
    constructor(name){
        this._name = name;
        this._tasks = [];
    }
    getTitle(){
        return this._name;
    }
    getTasks(){
        return this._tasks;
    }
    appendItemIntoTasks(newTask){
        this._tasks.push(newTask);
    }
}