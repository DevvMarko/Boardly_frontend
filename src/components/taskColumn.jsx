import React from 'react';
import TaskCard from './taskCard';

const TaskColumn = ({ col, tasks, onEditTask }) => {
  const columnTasks = tasks.filter(t => t.task_status === col.id);

  return (
    <div className="w-80 md:w-auto shrink-0 bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl p-5 flex flex-col gap-4 shadow-xl transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.12] group">
      {/* Column Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
        <div className={`w-3 h-3 rounded-full shadow-lg ${col.color}`} />
        <h2 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">{col.title}</h2>
        <span className="ml-auto bg-slate-800 text-slate-400 text-xs font-bold px-2.5 py-1 rounded-full border border-white/[0.05]">
          {columnTasks.length}
        </span>
      </div>

      {/* Column Content Area */}
      <div className="flex-1 min-h-[500px] rounded-xl border border-dashed border-white/[0.05] bg-slate-950/20 flex flex-col gap-3 p-4 transition-colors hover:bg-slate-950/40">
        {columnTasks.map(task => (
          <TaskCard key={task.task_id} task={task} onEditTask={onEditTask} />
        ))}

        {columnTasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center opacity-50">
            <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500">No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
