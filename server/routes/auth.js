const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

// Admin Login
router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const token = jwt.sign({ id: user.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: 'admin' });
  } catch (err) {
    console.error('Admin Login Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Admin Signup
router.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (existing) return res.status(400).json({ message: 'Username already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from('profiles')
      .insert([{ username, password_hash: hashedPassword, role: 'admin' }])
      .select()
      .single();

    if (error) throw error;

    const token = jwt.sign({ id: data.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: 'admin' });
  } catch (err) {
    console.error('Admin Signup Error:', err);
    res.status(500).json({ message: 'Error signing up admin' });
  }
});

// Student Login
router.post('/student/login', async (req, res) => {
  const { name, rollNumber } = req.body;
  try {
    const { data: student, error } = await supabase
      .from('students')
      .select('*')
      .eq('roll_number', rollNumber)
      .single();

    if (error || !student) return res.status(400).json({ message: 'Student not found. Please sign up first.' });

    const token = jwt.sign({ id: student.id, name: student.full_name, rollNumber: student.roll_number, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, role: 'student', name: student.full_name });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Student Signup
router.post('/student/signup', async (req, res) => {
  const { name, rollNumber } = req.body;
  try {
    const { data: existing } = await supabase
      .from('students')
      .select('id')
      .eq('roll_number', rollNumber)
      .maybeSingle();

    if (existing) return res.status(400).json({ message: 'Roll number already registered' });

    const { data, error } = await supabase
      .from('students')
      .insert([{ full_name: name, roll_number: rollNumber }])
      .select()
      .single();

    if (error) throw error;

    const token = jwt.sign({ id: data.id, name: data.full_name, rollNumber: data.roll_number, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, role: 'student', name: data.full_name });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Error signing up student' });
  }
});

module.exports = router;
