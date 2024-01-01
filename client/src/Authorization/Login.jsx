import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Container, Typography, TextField, Button, Grid, Paper, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = ({ updateUserLoginStatus }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      updateUserLoginStatus(true);
      navigate('/home');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setError('Password reset email sent. Check your inbox.');
    } catch (error) {
      setError('Error sending password reset email. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <h3 className='font-philosopher'>Welcome to..</h3>
      <h1>
        <span className='font-maps'>The21Trip.com</span>
      </h1>
      <p style={{ fontSize: "15px", marginLeft: "5rem" }} className='font-philosopher'>- luxury Journeys to 21 Destinations in India..!</p>
      <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Login
        </Typography>
        <form onSubmit={(e) => e.preventDefault()} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{ mt: 3 }}
          >
            Login
          </Button>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
            <Grid item>
              <RouterLink to="/" variant="body2" style={{ textDecoration: 'none', color: '#1976D2' }}>
                Don't have an account? Sign up here.
              </RouterLink>
            </Grid>
            <Grid item>
              <RouterLink to="#" variant="body2" onClick={handleForgotPassword} style={{ textDecoration: 'none', color: '#1976D2' }}>
                Forgot Password?
              </RouterLink>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
