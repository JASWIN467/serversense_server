import mongoose from 'mongoose';
import { Server, User, Alert, Metrics } from './Model/todoModel.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Server.deleteMany({});
    await User.deleteMany({});
    await Alert.deleteMany({});
    await Metrics.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      username: 'admin',
      email: 'admin@serversense.com',
      password: adminPassword,
      role: 'admin'
    });
    await admin.save();

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = new User({
      username: 'user',
      email: 'user@serversense.com',
      password: userPassword,
      role: 'user'
    });
    await user.save();

    // Create servers
    const servers = [
      { name: 'AWS-Prod-01', ip: '192.168.1.10', status: 'Online', region: 'us-east-1', load: 45 },
      { name: 'AWS-Prod-02', ip: '192.168.1.11', status: 'Warning', region: 'us-east-1', load: 88 },
      { name: 'DB-Cluster-Main', ip: '10.0.0.55', status: 'Online', region: 'eu-west-2', load: 23 },
      { name: 'Cache-Redis-01', ip: '10.0.0.60', status: 'Offline', region: 'ap-south-1', load: 0 },
      { name: 'Worker-Edge-05', ip: '172.16.5.21', status: 'Online', region: 'us-west-1', load: 12 }
    ];

    const savedServers = await Server.insertMany(servers);

    // Create alerts
    const alerts = [
      { serverId: savedServers[1]._id, message: 'High CPU Load (>90%) on Node-04', type: 'Critical' },
      { serverId: savedServers[0]._id, message: 'Redis Latency Spike detected', type: 'Warning' },
      { serverId: savedServers[2]._id, message: 'Backup completed with warnings', type: 'Warning' },
      { serverId: savedServers[4]._id, message: 'New admin user created', type: 'Info' }
    ];

    await Alert.insertMany(alerts);

    // Create metrics
    const metrics = [];
    savedServers.forEach(server => {
      for (let i = 0; i < 20; i++) {
        metrics.push({
          serverId: server._id,
          cpu: Math.floor(Math.random() * 80) + 10,
          memory: Math.floor(Math.random() * 70) + 20,
          disk: Math.floor(Math.random() * 60) + 30,
          network: Math.floor(Math.random() * 200) + 50,
          timestamp: new Date(Date.now() - i * 60000)
        });
      }
    });

    await Metrics.insertMany(metrics);

    console.log('Sample data inserted successfully!');
    console.log('Admin login: admin / admin123');
    console.log('User login: user / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();