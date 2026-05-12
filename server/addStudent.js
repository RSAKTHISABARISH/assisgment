require('dotenv').config();
const supabase = require('./supabase');

const addStudent = async (name, rollNumber) => {
  try {
    const { data: existing } = await supabase
      .from('students')
      .select('id')
      .eq('roll_number', rollNumber)
      .maybeSingle();

    if (existing) {
      console.log(`Student with roll number ${rollNumber} already exists.`);
      process.exit();
    }

    const { error } = await supabase
      .from('students')
      .insert([{
        full_name: name,
        roll_number: rollNumber
      }]);

    if (error) throw error;

    console.log(`✅ Success: Student ${name} (${rollNumber}) added to live database.`);
    process.exit();
  } catch (err) {
    console.error('❌ Error adding student:', err.message);
    process.exit(1);
  }
};

// Adding Kaviya as requested
addStudent('KAVIYA', '24108043');
