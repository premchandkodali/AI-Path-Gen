import { Toaster } from "./components/ui/toaster.jsx";
import { Toaster as Sonner } from "./components/ui/sonner.jsx";
import { TooltipProvider } from "./components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './components/Dashboard.jsx';

const queryClient = new QueryClient();

// Helper to check for token
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  // Check if token is valid (not expired)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    localStorage.removeItem('token'); // Remove invalid token
    return false;
  }
};

// Protected route component
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Global inline styles to replace the CSS
const globalStyles = {
  body: {
    backgroundColor: 'hsl(220, 14%, 96%)',
    color: 'hsl(222, 47%, 11%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    margin: 0,
    padding: 0,
    minHeight: '100vh',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  '*': {
    boxSizing: 'border-box'
  }
};

// Apply global styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    * {
      box-sizing: border-box;
      border-color: hsl(220, 13%, 91%);
    }
    
    body {
      background-color: hsl(220, 14%, 96%);
      color: hsl(222, 47%, 11%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    html {
      line-height: 1.5;
      -webkit-text-size-adjust: 100%;
      -moz-tab-size: 4;
      tab-size: 4;
    }
    
    button, input, optgroup, select, textarea {
      font-family: inherit;
      font-size: 100%;
      font-weight: inherit;
      line-height: inherit;
      color: inherit;
      margin: 0;
      padding: 0;
    }
    
    button, select {
      text-transform: none;
    }
    
    button, [type='button'], [type='reset'], [type='submit'] {
      -webkit-appearance: button;
      background-color: transparent;
      background-image: none;
    }
    
    :focus-visible {
      outline: 2px solid hsl(238, 64%, 59%);
      outline-offset: 2px;
    }
  `;
  
  if (!document.head.querySelector('#global-styles')) {
    styleElement.id = 'global-styles';
    document.head.appendChild(styleElement);
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated() ? <Index /> : <Navigate to="/login" />
            } 
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;