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
// Delete test
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // First delete associated submissions to avoid foreign key errors
    await supabase
      .from('submissions')
      .delete()
      .eq('test_id', id);

    // Then delete the test itself
    const { error } = await supabase
      .from('tests')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Test deleted successfully' });
  } catch (err) {
    console.error('Error deleting test:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
