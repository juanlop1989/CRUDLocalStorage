import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ShowProveedores from './components/ShowProveedores';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<ShowProveedores />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
