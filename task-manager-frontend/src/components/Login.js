import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Divider,
  Stack
} from '@mui/material';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', formData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <Paper elevation={3} sx={{ 
      maxWidth: 400, 
      mx: 'auto', 
      p: 4, 
      mt: 8,
      backgroundColor: '#E6F7FF' // Light blue background
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        align="center"
        sx={{ color: '#1976D2', mb: 3 }} // Blue text
      >
        Task Manager
      </Typography>
      
      <Typography variant="h5" gutterBottom align="center">
        Login
      </Typography>
      
      {error && (
        <Typography 
          color="error" 
          gutterBottom 
          align="center"
          sx={{ mb: 2 }}
        >
          {error}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          sx={{ 
            mt: 2, 
            mb: 2,
            backgroundColor: '#1976D2', // Blue button
            '&:hover': {
              backgroundColor: '#1565C0' // Darker blue on hover
            }
          }}
        >
          Login
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Stack direction="column" spacing={1} alignItems="center">
        <Typography variant="body1">
          Don't have an account?
        </Typography>
        <Button 
          component={Link}
          to="/register"
          variant="outlined"
          sx={{
            color: '#1976D2', // Blue text
            borderColor: '#1976D2', // Blue border
            '&:hover': {
              borderColor: '#1565C0' // Darker blue on hover
            }
          }}
        >
          Register
        </Button>
      </Stack>
    </Paper>
  );
};

export default Login;