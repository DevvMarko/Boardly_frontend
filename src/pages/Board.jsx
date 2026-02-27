import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TaskColumn from '../components/taskColumn';
import BoardEdit from '../components/boardEdit';
import TaskEdit from '../components/taskEdit';
import TaskAdd from '../components/taskAdd';

function Board() {
  const { boardCode } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const columns = [
    { id: 'to_do', title: 'To Do', color: 'bg-indigo-500' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-amber-500' },
    { id: 'completed', title: 'Completed', color: 'bg-emerald-500' },
    { id: 'wont_do', title: "Won't Do", color: 'bg-rose-500' },
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/boards/${boardCode}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        setBoard(data);
        setTasks(data.tasks || []);
        setLoading(false);
        if (data.board_code) {
          localStorage.setItem('recentBoardCode', data.board_code);
        }
      })
      .catch(error => {
        console.error('Error fetching board data:', error);
        setBoard(null);
        setTasks([]);
        setLoading(false);
        localStorage.removeItem('recentBoardCode');
      });
  }, [boardCode]);

  const handleUpdateBoard = async (updatedData) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/boards/${boardCode}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update board');
    }

    const updatedBoard = await response.json();
    setBoard(updatedBoard);
  };

  const handleDeleteBoard = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/boards/${boardCode}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete board');
      }

      localStorage.removeItem('recentBoardCode');
      setIsEditModalOpen(false);
      // Redirect to root, which will automatically create a new board
      navigate('/', { replace: true, state: { forceNew: true } });
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  const handleUpdateTask = async (taskId, updatedTaskData) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTaskData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update task');
    }

    const updatedTask = await response.json();
    setTasks(tasks.map(t => t.task_id === taskId ? updatedTask : t));
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
      }

      setTasks(tasks.filter(t => t.task_id !== taskId));
      setEditingTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCreateTask = async (newTaskData) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/boards/${boardCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTaskData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create task');
    }

    const createdTask = await response.json();
    setTasks([...tasks, createdTask]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 font-sans selection:bg-indigo-500/30">

      {/* Top Header */}
      <header className="px-8 py-10 max-w-7xl mx-auto flex flex-col gap-3 relative z-10">
        <div className="absolute inset-0 bg-indigo-500/5 blur-3xl -z-10 rounded-full" />

        <div className="flex items-center gap-4 group">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300">
            {loading ? 'Loading...' : board ? board.board_name : 'Board Not Found'}
          </h1>
          {board && !loading && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/', { state: { forceNew: true } })}
                className="opacity-100 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full"
                title="Create New Board"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="opacity-100 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-full"
                title="Edit Board"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
          {loading ? 'Fetching board details...' : board ? board.board_description : 'The board you are looking for does not exist or there was an error loading it.'}
        </p>
      </header>

      {/* Main Board Area */}
      {board && (
        <main className="px-8 pb-32 max-w-[1400px] mx-auto overflow-x-auto">
          <div className="flex gap-6 min-w-max md:min-w-0 md:grid md:grid-cols-4 items-start">
            {columns.map((col, index) => (
              <TaskColumn
                key={index}
                col={col}
                tasks={tasks}
                onEditTask={setEditingTask}
              />
            ))}
          </div>
        </main>
      )}

      {/* Fixed Add Task Button */}
      {board && (
        <div className="fixed bottom-8 left-8 z-50">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="group relative flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-6 py-4 rounded-full font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add new Task
          </button>
        </div>
      )}

      {/* Edit Board Modal */}
      <BoardEdit
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        board={board}
        onSave={handleUpdateBoard}
        onDelete={handleDeleteBoard}
      />

      {/* Add Task Modal */}
      <TaskAdd
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateTask}
      />

      {/* Edit Task Modal */}
      <TaskEdit
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onSave={handleUpdateTask}
        onDelete={handleDeleteTask}
      />

    </div>
  );
}

export default Board;
