import React, { useState, useEffect } from 'react';

const BoardEdit = ({ isOpen, onClose, board, onSave, onDelete }) => {
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Update internal state when board prop changes or modal opens
  useEffect(() => {
    if (board && isOpen) {
      setBoardName(board.board_name || '');
      setBoardDescription(board.board_description || '');
      setIsConfirmingDelete(false); // Reset confirmation state when re-opening
    }
  }, [board, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ board_name: boardName, board_description: boardDescription });
      onClose();
    } catch (error) {
      console.error("Failed to save board details", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = () => {
    if (isConfirmingDelete) {
      onDelete();
    } else {
      setIsConfirmingDelete(true);
      // Optional: reset confirmation state after 3 seconds
      setTimeout(() => setIsConfirmingDelete(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col gap-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-100">Edit Board Details</h2>
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
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="boardName" className="text-sm font-medium text-slate-300">Board Name</label>
            <input
              id="boardName"
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
              placeholder="e.g. Project Apollo"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="boardDesc" className="text-sm font-medium text-slate-300">Board Description</label>
            <textarea
              id="boardDesc"
              value={boardDescription}
              onChange={(e) => setBoardDescription(e.target.value)}
              rows="4"
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
              placeholder="Describe the purpose of this board..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
          {/* Delete Button Area (Left) */}
          <div>
            <button
              onClick={handleDeleteClick}
              className={`px-4 py-2.5 rounded-xl font-medium transition-all ${isConfirmingDelete
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20'
                  : 'text-rose-500 hover:bg-rose-500/10'
                }`}
            >
              {isConfirmingDelete ? 'Click again to confirm delete' : 'Delete Board'}
            </button>
          </div>

          {/* Standard Actions (Right) */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !boardName.trim()}
              className="px-5 py-2.5 rounded-xl font-medium bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
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

export default BoardEdit;
