class ListView{
    constructor(list,tasks,mode){
        this._list = list;
        this._tasks = tasks;
        this._mode = mode ?? "dashboard";
    }
    getListName(){
        return this._list;
    }
    getTasks(){
        return this._tasks;
    }
    getListViewMode(){
        return this._mode;
    }
}