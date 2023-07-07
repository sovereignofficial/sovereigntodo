import { calculateTasksDate, separateCompletedTasks } from "../lib/dashboardActions.js";

export class Dashboard{
    constructor(todayTasks,upcomingTasks,dueTasks,completedTasks,pendingTasks){
         this.todayTasks = todayTasks
         this.upcomingTasks = upcomingTasks
         this.dueTasks = dueTasks
         this.completedTasks = completedTasks
         this.pendingTasks = pendingTasks
    }
    getDashboardInfo(){
        return {
            todayTasks:this.todayTasks,
            upcomingTasks:this.upcomingTasks,
            dueTasks:this.dueTasks,
            completedTasks:this.completedTasks,
            pendingTasks:this.pendingTasks,
        }
    }
    adjustDashboard(tasks){
        const {todayTasks , upcomingTasks , dueTasks} = calculateTasksDate(tasks);
        const {completedTasks,pendingTasks} = separateCompletedTasks(tasks);
        this.todayTasks = todayTasks;
        this.upcomingTasks = upcomingTasks;
        this.dueTasks = dueTasks;
        this.completedTasks = completedTasks;
        this.pendingTasks = pendingTasks;
    }
}