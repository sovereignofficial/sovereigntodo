class TaskView{
    constructor(task){
        this._task = task;
    }
    getTaskItems(){
        return {...this._task}
    }
}