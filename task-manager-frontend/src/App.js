import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext } from 'react-beautiful-dnd';
import { CssBaseline, Container, Paper, Typography, AppBar, Toolbar, Button, Box } from '@mui/material';
import Login from './components/Login';
import Register from './components/Register';
import TaskBoard from './components/TaskBoard';

axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#F5F5DC' // Cream background
      }}>
        <AppBar position="static" sx={{ backgroundColor: '#1976D2' }}> {/* Blue header */}
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Task Manager
            </Typography>
            {user && (
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            )}
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ 
            p: 3, 
            backgroundColor: '#E6F7FF' // Light blue background
          }}>
            <Routes>
              <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
              <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/" />} />
              <Route path="/" element={user ? <TaskBoard user={user} /> : <Navigate to="/login" />} />
            </Routes>
          </Paper>
        </Container>
      </Box>
    </BrowserRouter>
  );
}

export default App;