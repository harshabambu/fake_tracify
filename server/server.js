const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const collabRoutes = require('./routes/collabRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // ✅ Make sure this is only declared once

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/tracify', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Locally'))
.catch(err => console.error('🚨 MongoDB Connection Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/collab', collabRoutes);
app.use('/api/notifications', notificationRoutes); // ✅ Use the import

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
