import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import TechCards from './pages/TechCards/TechCards'; // Главный компонент техкарт
import './App.css';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/tech-cards" />} 
          />
          <Route 
            path="/tech-cards" 
            element={isAuthenticated ? <TechCards /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/tech-cards" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;