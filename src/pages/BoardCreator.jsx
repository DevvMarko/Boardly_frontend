import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';

function BoardCreator() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasCreatedBoard = useRef(false);

  useEffect(() => {
    // Prevent React StrictMode from double-invoking the POST request in development
    if (hasCreatedBoard.current) return;
    hasCreatedBoard.current = true;

    const recentBoardCode = localStorage.getItem('recentBoardCode');
    if (recentBoardCode && !location.state?.forceNew) {
      navigate(`/${recentBoardCode}`, { replace: true });
      return;
    }

    const createNewBoard = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/boards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            board_name: "My New Workspace",
            board_description: "Welcome to your new board!"
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create board');
        }

        const newBoard = await response.json();

        // Redirect to the new board's code
        navigate(`/${newBoard.board_code}`, { replace: true });
      } catch (error) {
        console.error("Error creating new board:", error);
      }
    };

    createNewBoard();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full animate-pulse" />
        <svg className="animate-spin h-12 w-12 text-indigo-500 relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-200">Creating your workspace...</h2>
      <p className="text-slate-500 font-medium">Setting up a fresh board just for you.</p>
    </div>
  );
}

export default BoardCreator;
