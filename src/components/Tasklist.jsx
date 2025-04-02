import React from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Typography,
  Box,
  Divider,
  Tooltip,
  Fade,
  Checkbox,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircleOutline,
  RadioButtonUnchecked
} from '@mui/icons-material';

const TaskList = ({ tasks, onEdit, onDelete, onToggleComplete }) => {
  if (tasks.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
        <Typography variant="body1" color="text.secondary">
          No tasks found. Add a new task to get started!
        </Typography>
      </Paper>
    );
  }

  return (
    <Fade in={true}>
      <Paper elevation={3} sx={{ mt: 4 }}>
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: '12px 12px 0 0' }}>
          <Typography variant="h6">
            Your Tasks ({tasks.length})
          </Typography>
        </Box>
        <List sx={{ p: 0 }}>
          {tasks.map((task, index) => (
            <React.Fragment key={task._id}>
              <ListItem
                sx={{
                  py: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <Checkbox
                  checked={task.completed}
                  onChange={() => onToggleComplete(task)}
                  icon={<RadioButtonUnchecked />}
                  checkedIcon={<CheckCircleOutline />}
                  sx={{ mr: 1 }}
                />
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle1"
                      sx={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'text.secondary' : 'text.primary'
                      }}
                    >
                      {task.title}
                    </Typography>
                  }
                  secondary={
                    task.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          textDecoration: task.completed ? 'line-through' : 'none',
                          mt: 0.5
                        }}
                      >
                        {task.description}
                      </Typography>
                    )
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Edit task" arrow>
                    <IconButton
                      edge="end"
                      onClick={() => onEdit(task)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete task" arrow>
                    <IconButton
                      edge="end"
                      onClick={() => onDelete(task._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              {index < tasks.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Fade>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      completed: PropTypes.bool
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func.isRequired
};

export default TaskList;