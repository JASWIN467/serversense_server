import mongoose from "mongoose";

// Server Schema
const serverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ip: { type: String, required: true },
  status: { type: String, enum: ['Online', 'Offline', 'Warning'], default: 'Online' },
  region: { type: String, required: true },
  load: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Alert Schema
const alertSchema = new mongoose.Schema({
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
  message: { type: String, required: true },
  type: { type: String, enum: ['Critical', 'Warning', 'Info'], required: true },
  resolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Metrics Schema
const metricsSchema = new mongoose.Schema({
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
  cpu: { type: Number, required: true },
  memory: { type: Number, required: true },
  disk: { type: Number, required: true },
  network: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

export const Server = mongoose.model('Server', serverSchema);
export const User = mongoose.model('User', userSchema);
export const Alert = mongoose.model('Alert', alertSchema);
export const Metrics = mongoose.model('Metrics', metricsSchema);
