import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { CanchasContextProvider } from './context/contextCanchas';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import AddCancha from './components/AddCancha';
import ActualizarCancha from './components/ActualizarCancha';
import DetallesCancha from './routes/DetallesCancha';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CanchasContextProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/agregar" 
              element={
                <PrivateRoute>
                  <AddCancha />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/actualizar/:id" 
              element={
                <PrivateRoute>
                  <ActualizarCancha />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/canchas/:id" 
              element={
                <PrivateRoute>
                  <DetallesCancha />
                </PrivateRoute>
              } 
            />
            {/* Redirige a /login para cualquier ruta desconocida */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
          </BrowserRouter>
          <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          />
        </CanchasContextProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
