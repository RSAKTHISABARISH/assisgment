require('dotenv').config();
const supabase = require('./supabase');

const seedStudent = async () => {
  const name = 'sakthi';
  const rollNumber = '24110083';

  try {
    const { data: existing } = await supabase
      .from('students')
      .select('id')
      .eq('roll_number', rollNumber)
      .maybeSingle();

    if (existing) {
      console.log('Student already exists');
      process.exit();
    }

    const { error } = await supabase
      .from('students')
      .insert([{
        full_name: name,
        roll_number: rollNumber
      }]);

    if (error) throw error;

    console.log(`Student created: ${name} (${rollNumber})`);
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedStudent();
