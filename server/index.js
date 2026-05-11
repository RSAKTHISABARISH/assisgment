require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection (Supabase used via supabase.js)
console.log('Supabase integration enabled');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/submissions', require('./routes/submissions'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
