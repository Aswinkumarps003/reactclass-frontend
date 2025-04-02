import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, Box, Typography, Paper, Zoom } from '@mui/material';
import { Add as AddIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [titleError, setTitleError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    onSubmit({ title, description });
    if (!task) {
      setTitle('');
      setDescription('');
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (titleError) setTitleError(false);
  };

  return (
    <Zoom in={true}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom color="primary">
            {task ? 'Edit Task' : 'Add New Task'}
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Title"
            value={title}
            onChange={handleTitleChange}
            error={titleError}
            helperText={titleError ? 'Title is required' : ''}
            sx={{ mb: 2 }}
            autoFocus
          />
          <TextField
            margin="normal"
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 3 }}
            placeholder="Add details about your task..."
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {onCancel && (
              <Button
                variant="outlined"
                onClick={onCancel}
                startIcon={<CancelIcon />}
                color="inherit"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              startIcon={task ? <SaveIcon /> : <AddIcon />}
              color="primary"
            >
              {task ? 'Save Changes' : 'Add Task'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Zoom>
  );
};

TaskForm.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func
};

export default TaskForm;