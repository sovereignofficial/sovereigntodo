class Database{
    static saveTasksIntoDb(tasks){
        try{
            const savedTasks = localStorage.setItem('tasks',JSON.stringify(tasks));
            console.log("saved",savedTasks)
        }catch(e){
            console.error(e);
        }

    } 
    static getTasksFromDb(){
        try{
            const tasks = JSON.parse(localStorage.getItem('tasks')) ?? [];
            return [...tasks.map(({_task,_list,_description,_date,_tags,_subtasks,_completed})=>{
             return new Task(_task,_list,_description,_date,_tags,_subtasks,_completed);
            })]
        }catch(e){
            console.error(e);
        }

    }
    static saveListsIntoDb(lists){
        try{
            const savedLists = localStorage.setItem('lists',JSON.stringify(lists));
            console.log("saved",savedLists)
    
        }catch(e){
            console.error(e);
        }
    }
    static getListsFromDb(){
        try{
            const lists = JSON.parse(localStorage.getItem('lists')) ?? [];

            return [...lists.map(({_name,_tasks})=>{
             return new List(_name,_tasks)
            })]
        }catch(e){
            console.error(e);
        }
    }
    static saveTagsIntoDb(tags){
        try{
            const savedTags = localStorage.setItem('tags',JSON.stringify(tags));
            console.log("saved",savedTags)
    
        }catch(e){
            console.error(e)
        }
    }
    static getTagsFromDb(){
        try{
            const tags = JSON.parse(localStorage.getItem('tags')) ?? [];

            return [...tags.map(({_name,_bg,_tasks})=>{
                return new Tag(_name,_bg,_tasks);
            })]
    
        }catch(e){
            console.error(e);
        }
    }
    static saveTheme(darkMode){
       localStorage.setItem("darkMode",JSON.stringify(darkMode));
    }
    static getTheme(){
        return {darkMode:JSON.parse(localStorage.getItem("darkMode"))}
    }
}