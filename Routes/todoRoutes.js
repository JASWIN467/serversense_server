import { 
  register, login, 
  getServers, addServer, updateServer, deleteServer,
  getMetrics, addMetrics,
  getAlerts, addAlert, updateAlert,
  getUsers, getUserProfile 
} from "../Controller/todoController.js";

import express from 'express';

const route = express.Router();

// Auth routes
route.post('/auth/register', register);
route.post('/auth/login', login);

// Server routes
route.get('/servers', getServers);
route.post('/servers', addServer);
route.put('/servers/:id', updateServer);
route.delete('/servers/:id', deleteServer);

// Metrics routes
route.get('/metrics', getMetrics);
route.post('/metrics', addMetrics);

// Alert routes
route.get('/alerts', getAlerts);
route.post('/alerts', addAlert);
route.put('/alerts/:id', updateAlert);

// User routes
route.get('/users', getUsers);
route.get('/users/:id', getUserProfile);

export default route;



