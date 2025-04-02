import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import TaskForm from '../components/Taskform';
import TaskList from '../components/Tasklist';
import { 
  Container, 
  Typography, 
  Alert, 
  CircularProgress, 
  Box, 
  Snackbar,
  Paper,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#6c5ce7',
    },
    secondary: {
      main: '#a29bfe',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.5px',
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: '1rem',
      opacity: 0.8,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      setError('Failed to load tasks. Please refresh the page.');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    setError(null);
    try {
      await axios.post('/api/tasks', taskData);
      await fetchTasks();
      showSnackbar('Task added successfully!');
    } catch (error) {
      setError('Failed to add task. Please try again.');
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    setError(null);
    try {
      await axios.patch(`/api/tasks/${editingTask._id}`, taskData);
      setEditingTask(null);
      await fetchTasks();
      showSnackbar('Task updated successfully!');
    } catch (error) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setError(null);
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      await fetchTasks();
      showSnackbar('Task deleted!', 'info');
    } catch (error) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (task) => {
    setError(null);
    try {
      await axios.patch(`/api/tasks/${task._id}`, {
        completed: !task.completed
      });
      await fetchTasks();
      showSnackbar(
        `Task marked as ${!task.completed ? 'completed' : 'incomplete'}!`
      );
    } catch (error) {
      setError('Failed to update task status.');
      console.error('Error updating task:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container 
        maxWidth="md" 
        sx={{
          minHeight: '100vh',
          py: 6,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Box
          sx={{
            maxWidth: 800,
            mx: 'auto',
            animation: 'fadeIn 0.6s cubic-bezier(0.39, 0.575, 0.565, 1)',
          }}
        >
          {/* Header Section */}
          <Box 
            sx={{ 
              mb: 6,
              textAlign: 'center',
              '&:hover h1': {
                transform: 'translateY(-2px)',
              }
            }}
          >
            <Typography
              variant="h1"
              sx={{
                mb: 1,
                background: 'linear-gradient(45deg, #6c5ce7 30%, #a29bfe 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                transition: 'transform 0.3s ease',
              }}
            >
              TaskFlow
            </Typography>
            <Typography 
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
                fontSize: '1.1rem',
              }}
            >
              Streamline your productivity
            </Typography>
          </Box>

          {/* Main Content */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              mb: 4,
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>
            )}

            {/* Task Form */}
            {editingTask ? (
              <TaskForm
                task={editingTask}
                onSubmit={handleUpdateTask}
                onCancel={() => setEditingTask(null)}
              />
            ) : (
              <TaskForm onSubmit={handleAddTask} />
            )}
          </Paper>

          {/* Task List */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3,
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              position: 'relative',
              minHeight: 200,
            }}
          >
            {loading ? (
              <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                height={200}
              >
                <CircularProgress 
                  size={60} 
                  thickness={4}
                  sx={{ 
                    color: 'primary.main',
                    animation: 'pulse 1.5s ease infinite',
                  }} 
                />
              </Box>
            ) : (
              <TaskList
                tasks={tasks}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
              />
            )}
          </Paper>
        </Box>

        {/* Snackbar Notification */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }
          }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            elevation={6}
            variant="filled"
            sx={{
              width: '100%',
              alignItems: 'center',
              fontSize: '0.9rem',
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Global Styles */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.7;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          body {
            background-color: ${theme.palette.background.default};
          }
        `}</style>
      </Container>
    </ThemeProvider>
  );
};

export default HomePage;