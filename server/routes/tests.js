const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const { generateMCQs } = require('../controllers/aiController');

// Create test with AI
router.post('/generate', async (req, res) => {
  const { topic } = req.body;
  try {
    const questions = await generateMCQs(topic);
    const { data, error } = await supabase
      .from('tests')
      .insert([{ topic, questions }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating test' });
  }
});

// Get all tests
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching tests:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get single test
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching single test:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
