import { useState, useEffect } from "react"
import "./App.css"

function App() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => {
        setHealth(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching health:", err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="App">
      <h1>🏭 TechCard System</h1>
      <p>Система учёта технологических карт</p>
      
      {loading ? (
        <p>Проверка соединения с сервером...</p>
      ) : health ? (
        <div style={{ 
          background: "#e8f5e8", 
          padding: "1rem", 
          borderRadius: "8px",
          margin: "1rem 0"
        }}>
          <h3>✅ Сервер работает</h3>
          <p><strong>Статус:</strong> {health.status}</p>
          <p><strong>Сообщение:</strong> {health.message}</p>
          <p><strong>Время:</strong> {new Date(health.timestamp).toLocaleString()}</p>
        </div>
      ) : (
        <div style={{ 
          background: "#ffe8e8", 
          padding: "1rem", 
          borderRadius: "8px",
          margin: "1rem 0"
        }}>
          <h3>❌ Ошибка соединения</h3>
          <p>Не удалось подключиться к серверу</p>
        </div>
      )}
    </div>
  )
}

export default App
