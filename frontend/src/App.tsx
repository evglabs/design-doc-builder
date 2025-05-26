import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { DocumentEditorPage } from './pages/DocumentEditorPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ThemeProvider } from './components/ThemeProvider'

function App() {
  const { user } = useAuthStore()
  
  return (
    <ThemeProvider>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <Routes>
          {/* Auth routes */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
          />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/document/:id"
            element={
              <ProtectedRoute>
                <DocumentEditorPage />
              </ProtectedRoute>
            }
          />
          
          {/* Default redirect */}
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
          />
          
          {/* Catch all */}
          <Route
            path="*"
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
