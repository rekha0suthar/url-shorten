import './App.css';
import { AuthProvider } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Analytics from './pages/Analytics';
import TopicAnalytics from './pages/TopicAnalytics';
import UrlList from './pages/UrlList';
import ErrorBoundary from './components/ErrorBoundary';
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/analytics/:shortUrl"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/topic/:topic"
              element={
                <ProtectedRoute>
                  <TopicAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <UrlList />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
