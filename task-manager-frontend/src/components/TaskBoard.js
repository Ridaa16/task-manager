import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { TextField, Button, Typography, Box, Paper, List, ListItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const statusConfig = {
  todo: { label: 'To Do', color: '#FFCDD2' },
  'in-progress': { label: 'In Progress', color: '#BBDEFB' },
  done: { label: 'Done', color: '#C8E6C9' }
};

const TaskBoard = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async () => {
    try {
      await axios.post('/api/tasks', newTask, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewTask({ title: '', description: '', status: 'todo' });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTask = async (task) => {
    try {
      await axios.patch(`/api/tasks/${task._id}`, task, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, movedTask);

    setTasks(updatedTasks);

    try {
      await axios.patch(`/api/tasks/${movedTask._id}`, {
        status: movedTask.status,
        position: result.destination.index
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (err) {
      console.error(err);
      fetchTasks();
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Welcome, {user.username}</Typography>
      
      {/* Add Task Form */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#E6F7FF' }}>
        <Typography variant="h6" gutterBottom>Add New Task</Typography>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={newTask.title}
          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={2}
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
        />
        <Button 
          variant="contained" 
          onClick={handleAddTask}
          sx={{ mt: 2 }}
        >
          Add Task
        </Button>
      </Paper>

      {/* Task Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {Object.entries(statusConfig).map(([status, config]) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ 
                    p: 2, 
                    flex: 1,
                    backgroundColor: '#E6F7FF'
                  }}
                >
                  <Typography variant="h6">{config.label}</Typography>
                  <List>
                    {tasks
                      .filter(task => task.status === status)
                      .map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <ListItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                mb: 1,
                                p: 2,
                                backgroundColor: '#FFFFFF',
                                borderRadius: 1,
                                boxShadow: 1
                              }}
                            >
                              {editingId === task._id ? (
                                <Box sx={{ width: '100%' }}>
                                  <TextField
                                    fullWidth
                                    value={task.title}
                                    onChange={(e) => setTasks(tasks.map(t => 
                                      t._id === task._id ? {...t, title: e.target.value} : t
                                    ))}
                                    sx={{ mb: 1 }}
                                  />
                                  <TextField
                                    fullWidth
                                    multiline
                                    value={task.description}
                                    onChange={(e) => setTasks(tasks.map(t => 
                                      t._id === task._id ? {...t, description: e.target.value} : t
                                    ))}
                                    sx={{ mb: 1 }}
                                  />
                                  <Button 
                                    variant="contained" 
                                    onClick={() => handleUpdateTask(task)}
                                    sx={{ mr: 1 }}
                                  >
                                    Save
                                  </Button>
                                  <Button 
                                    variant="outlined" 
                                    onClick={() => setEditingId(null)}
                                  >
                                    Cancel
                                  </Button>
                                </Box>
                              ) : (
                                <>
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1">{task.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {task.description}
                                    </Typography>
                                  </Box>
                                  <IconButton onClick={() => setEditingId(task._id)}>
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton onClick={() => handleDeleteTask(task._id)}>
                                    <DeleteIcon color="error" />
                                  </IconButton>
                                </>
                              )}
                            </ListItem>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </List>
                </Paper>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default TaskBoard;