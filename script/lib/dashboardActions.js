export const calculateTasksDate = (tasks) => {
  const todayTasks = [];
  const upcomingTasks = [];
  const dueTasks = [];

  for (let task of tasks) {
    if (task.getTaskInfo().completed) continue;

    const today = new Date();
    const date = new Date(task.getTaskInfo().date);
    const remainDay = Math.floor((date - today) / (1000 * 60 * 60 * 24));

    if (remainDay === 0) {
      todayTasks.push(task);
    } else if (remainDay > 0 && remainDay <= 7) {
      upcomingTasks.push(task);
    } else {
      dueTasks.push(task);
    }
  }

  return { todayTasks, upcomingTasks, dueTasks };
};
export const separateCompletedTasks = (tasks)=> {
  const completedTasks = [];
  const pendingTasks = [];

  for (let task of tasks) {
    if (task.getTaskInfo().completed) {
      completedTasks.push(task);
    } else {
      pendingTasks.push(task);
    }
  }

  return { completedTasks, pendingTasks };
}