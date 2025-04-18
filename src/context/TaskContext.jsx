import React, { createContext, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAuth } from "./AuthContext";
import api from "../utils/api";

const TaskContext = createContext({});

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  const fetchTasks = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const getTaskById = async (id) => {
    // Don't reload if we already have this task
    if (currentTask && currentTask._id === id && !loading) {
      return currentTask;
    }
    
    setLoading(true);
    try {
      const { data } = await api.get(`/tasks/${id}`);
      setCurrentTask(data.data);
      return data.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      toast.error('Failed to load task details');
      navigate('/404');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    setLoading(true);
    try {
      const { data } = await api.post('/tasks/create', taskData);
      setTasks([data.data, ...tasks]);
      toast.success('Task created successfully');
      return data.data;
    } catch (error) {
      console.error('Error creating task:', error);
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, taskData) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/tasks/${id}`, taskData);
      setTasks(tasks.map(task => task._id === id ? data.data : task));
      setCurrentTask(data.data);
      toast.success('Task updated successfully');
      return data.data;
    } catch (error) {
      console.error('Error updating task:', error);
      const message = error.response?.data?.message || 'Failed to update task';
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      toast.success('Task deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (id, completed) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/tasks/${id}`, { completed });
      setTasks(tasks.map(task => task._id === id ? data.data : task));
      toast.success(`Task marked as ${completed ? 'completed' : 'incomplete'}`);
      return data.data;
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    tasks,
    currentTask,
    loading,
    fetchTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};