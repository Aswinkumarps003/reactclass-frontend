import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import TaskForm from '../components/Taskform';
import TaskList from '../components/Tasklist';
import { Container, Typography, Alert, CircularProgress, Box, Snackbar } from '@mui/material';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
      setError('Error fetching tasks. Please try again later.');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    setError(null);
    try {
      await axios.post('/api/tasks', taskData);
      fetchTasks();
      showSnackbar('Task added successfully!');
    } catch (error) {
      setError('Error adding task. Please try again.');
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    setError(null);
    try {
      await axios.patch(`/api/tasks/${editingTask._id}`, taskData);
      setEditingTask(null);
      fetchTasks();
      showSnackbar('Task updated successfully!');
    } catch (error) {
      setError('Error updating task. Please try again.');
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setError(null);
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      fetchTasks();
      showSnackbar('Task deleted successfully!', 'info');
    } catch (error) {
      setError('Error deleting task. Please try again.');
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (task) => {
    setError(null);
    try {
      await axios.patch(`/api/tasks/${task._id}`, {
        completed: !task.completed
      });
      fetchTasks();
      showSnackbar(
        `Task marked as ${!task.completed ? 'completed' : 'incomplete'}!`,
        'success'
      );
    } catch (error) {
      setError('Error updating task. Please try again.');
      console.error('Error updating task:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        mt: 4, 
        mb: 6,
        textAlign: 'center',
        animation: 'fadeIn 0.5s ease-in'
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          Task Manager
        </Typography>
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Organize your tasks efficiently
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {editingTask ? (
        <TaskForm
          task={editingTask}
          onSubmit={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
        />
      ) : (
        <TaskForm onSubmit={handleAddTask} />
      )}
      
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Container>
  );
};

export default HomePage;