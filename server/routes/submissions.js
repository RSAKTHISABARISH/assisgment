const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Submit test
router.post('/', async (req, res) => {
  const { studentName, rollNumber, testId, answers, score, timeTaken } = req.body;
  try {
    const { data, error } = await supabase
      .from('submissions')
      .insert([{
        student_name: studentName,
        roll_number: rollNumber,
        test_id: testId,
        answers,
        score,
        time_taken: timeTaken
      }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving submission' });
  }
});

// Get all submissions
router.get('/', async (req, res) => {
  try {
    // Joining with tests table to get topic
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        testId:tests (topic)
      `)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    
    // Map data to match previous frontend expectations (snake_case to camelCase)
    const formatted = data.map(s => ({
      ...s,
      studentName: s.student_name,
      rollNumber: s.roll_number,
      timeTaken: s.time_taken,
      submittedAt: s.submitted_at,
      testId: s.testId // This will be { topic: '...' }
    }));
    
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
