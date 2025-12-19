import { Server, Alert, Metrics } from "../Model/todoModel.js";
import User from "../Model/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ====================== AUTH ======================
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================== SERVERS ======================
export const getServers = async (req, res) => {
  try {
    const servers = await Server.find();
    res.json(servers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addServer = async (req, res) => {
  try {
    const server = new Server(req.body);
    await server.save();
    res.status(201).json(server);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateServer = async (req, res) => {
  try {
    const server = await Server.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!server) return res.status(404).json({ message: "Server not found" });
    res.json(server);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteServer = async (req, res) => {
  try {
    const server = await Server.findByIdAndDelete(req.params.id);
    if (!server) return res.status(404).json({ message: "Server not found" });
    res.json({ message: "Server deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================== METRICS ======================
export const getMetrics = async (req, res) => {
  try {
    const metrics = await Metrics.find().populate('serverId').sort({ timestamp: -1 }).limit(100);
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addMetrics = async (req, res) => {
  try {
    const metrics = new Metrics(req.body);
    await metrics.save();
    res.status(201).json(metrics);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ====================== ALERTS ======================
export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().populate('serverId').sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addAlert = async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ====================== USERS ======================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    const updateData = { username, email, role };

    // Only hash/update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // Return updated doc
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
