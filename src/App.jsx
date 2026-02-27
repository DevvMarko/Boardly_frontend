import { Routes, Route } from 'react-router-dom';
import BoardCreator from './pages/BoardCreator';
import Board from './pages/Board';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BoardCreator />} />
      <Route path="/:boardCode" element={<Board />} />
    </Routes>
  );
}

export default App;
