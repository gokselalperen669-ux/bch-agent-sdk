import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AgentLab from './pages/AgentLab';
import ContractBase from './pages/ContractBase';
import Vault from './pages/Vault';
import KnowledgeBase from './pages/KnowledgeBase';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import TokenExchange from './pages/TokenExchange';
import AgentStudio from './pages/AgentStudio';
import Connectors from './pages/Connectors';
import DocumentationWebsite from './Docs';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-color/20 border-t-primary-color rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lab" element={<AgentLab />} />
        <Route path="/contracts" element={<ContractBase />} />
        <Route path="/wallet" element={<Vault />} />
        <Route path="/data" element={<KnowledgeBase />} />

        <Route path="/studio" element={<AgentStudio />} />
        <Route path="/exchange" element={<TokenExchange />} />
        <Route path="/connectors" element={<Connectors />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/docs" element={<DocumentationWebsite />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
