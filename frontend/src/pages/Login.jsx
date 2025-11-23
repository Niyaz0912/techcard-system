import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('temp123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { username, password });
      console.log('Login response:', response.data);
      
      if (response.data.success && response.data.user && response.data.token) {
        login(response.data.user, response.data.token);
        navigate('/tech-cards'); // Редирект!
      } else {
        setError('Неверный ответ от сервера');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 bg-light d-flex align-items-center justify-content-center">
      <div className="card shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-header bg-primary text-white text-center py-3">
          <h4 className="card-title mb-1">Вход в систему</h4>
          <p className="card-subtitle small opacity-75 mb-0">Система учета технологических карт</p>
        </div>
        
        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-semibold">Логин</label>
              <input
                id="username"
                type="text"
                className="form-control form-control-lg"
                placeholder="Введите логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">Пароль</label>
              <input
                id="password"
                type="password"
                className="form-control form-control-lg"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Вход...
                </>
              ) : (
                'Войти в систему'
              )}
            </button>
          </form>
        </div>
        
        <div className="card-footer text-center text-muted py-3">
          <small className="text-muted">Тестовые данные: admin / temp123</small>
        </div>
      </div>
    </div>
  );
}