import './App.css';
import { AuthProvider } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
