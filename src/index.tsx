import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Game from '@candela/components/game';

export default <BrowserRouter>
    <Routes>
      <Route path="/" element={<Game participationId={1} gameId={1} />} />
    </Routes>
  </BrowserRouter>;

