class Tag {
    constructor(name,color,tasks){
        this._name = name;
        this._tasks = tasks ?? [] ;
        this._bg = color
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
    getBgColor(){
        return this._bg
    }
}