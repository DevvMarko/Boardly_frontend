import React from 'react';

const TaskCard = ({ task, onEditTask }) => {
  return (
    <div
      onClick={() => onEditTask(task)}
      className="w-full bg-slate-800/80 p-4 rounded-xl flex flex-col gap-2 shadow-sm border border-white/5 transition-all hover:bg-slate-800 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xl bg-white/5 p-1.5 rounded-lg group-hover:bg-indigo-500/20 transition-colors">{task.task_icon}</span>
          <h3 className="text-slate-100 font-medium group-hover:text-indigo-300 transition-colors">{task.task_name}</h3>
        </div>
      </div>
      {task.task_description && (
        <p className="text-slate-400 text-sm ml-11 line-clamp-2">{task.task_description}</p>
      )}
    </div>
  );
};

export default TaskCard;
