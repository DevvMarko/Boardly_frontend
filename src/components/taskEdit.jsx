import React, { useState, useEffect } from 'react';

const ICONS = ['💻', '💬', '☕', '🏋️', '📚', '⏰'];

const STATUSES = [
  { id: 'to_do', label: 'To Do', color: 'bg-indigo-500', icon: '📝' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-amber-500', icon: '⏳' },
  { id: 'completed', label: 'Completed', color: 'bg-emerald-500', icon: '✅' },
  { id: 'wont_do', label: 'Won\'t Do', color: 'bg-rose-500', icon: '❌' },
];

const TaskEdit = ({ isOpen, onClose, task, onSave, onDelete }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskIcon, setTaskIcon] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      setTaskName(task.task_name || '');
      setTaskDescription(task.task_description || '');
      setTaskIcon(task.task_icon || ICONS[0]);
      setTaskStatus(task.task_status || 'to_do');
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(task.task_id, {
        task_name: taskName,
        task_description: taskDescription,
        task_icon: taskIcon,
        task_status: taskStatus
      });
      onClose();
    } catch (error) {
      console.error("Failed to save task details", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col gap-6 my-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <span className="text-3xl bg-white/5 p-2 rounded-xl">{taskIcon}</span>
            Edit Task
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-6">

          {/* Name & Description */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Task Name</label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                placeholder="e.g. Clean the kitchen"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Description</label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                rows="3"
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                placeholder="Add any extra details..."
              />
            </div>
          </div>

          {/* Icon Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setTaskIcon(icon)}
                  className={`w-12 h-12 text-2xl flex items-center justify-center rounded-xl transition-all ${taskIcon === icon
                    ? 'bg-indigo-500/20 border-2 border-indigo-500 shadow-inner'
                    : 'bg-white/5 border border-transparent hover:bg-white/10'
                    }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Status Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Status</label>
            <div className="grid grid-cols-2 gap-3">
              {STATUSES.map((status) => (
                <button
                  key={status.id}
                  onClick={() => setTaskStatus(status.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${taskStatus === status.id
                    ? `border-${status.color.replace('bg-', '')} bg-${status.color.replace('bg-', '')}/10`
                    : 'border-white/5 bg-slate-950/40 hover:bg-slate-950/60 hover:border-white/10'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${status.color} shadow-lg`}>
                    <span className="text-sm">{status.icon}</span>
                  </div>
                  <span className={`font-medium ${taskStatus === status.id ? 'text-white' : 'text-slate-400'}`}>
                    {status.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-2">
          <button
            onClick={() => onDelete(task.task_id)}
            className="px-5 py-2.5 rounded-xl font-medium text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Delete
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !taskName.trim()}
              className="px-6 py-2.5 rounded-xl font-medium bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {isSaving ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Save Changes"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaskEdit;
