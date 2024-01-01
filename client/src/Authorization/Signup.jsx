import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Container, Typography, TextField, Button, Grid, Paper, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Signup = ({ updateUserLoginStatus }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const authInstance = getAuth();
      await createUserWithEmailAndPassword(authInstance, email, password);
      updateUserLoginStatus(true);
      navigate('/home');
    } catch (error) {
      setError('Error signing up. Please try again.');
      console.error(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <h3 className='font-philosopher'>Welcome to..</h3>
      <h1>
        <span className='font-maps'>The21Trip.com</span>
        <p style={{ fontSize: "15px", marginLeft: "5rem" }} className='font-philosopher'>- luxury Journeys to 21 Destinations in India..!</p>
      </h1>
      <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Sign Up
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                variant="outlined"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSignup}
            sx={{ mt: 3 }}
          >
            Sign Up
          </Button>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <Grid item>
              <RouterLink to="/login" variant="body2" style={{ textDecoration: 'none', color: '#1976D2' }}>
                Already have an account? Log in here.
              </RouterLink>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Signup;
