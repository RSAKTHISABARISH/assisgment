require('dotenv').config();
const bcrypt = require('bcryptjs');
const supabase = require('./supabase');

const seedAdmin = async () => {
  const username = 'admin';
  const password = 'admin123';

  try {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (existing) {
      console.log('Admin already exists');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const { error } = await supabase
      .from('profiles')
      .insert([{
        username,
        password_hash: hashedPassword,
        role: 'admin'
      }]);

    if (error) throw error;

    console.log('Admin created: user: admin, pass: admin123');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedAdmin();
