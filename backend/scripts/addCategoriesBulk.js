// DEPRECATED: this script was used for seeding default categories during development.
// Categories can now be added dynamically from the instructor/admin dashboard, so
// running this file is generally no longer necessary.

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const Category = require('../models/category');

// Categories to insert
const categories = [
  'Web Development',
  'AI/Automation',
  'UI/UX',
  'MERN Stack',
  'Mechine Learning',
  'Java Full Stack',
  'Python Full Stack',
  'Block Chain',
];

const args = process.argv.slice(2);
// optional: pass mongodb uri as first arg
const dbUrl = args[0] || process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('No MongoDB connection string provided. Set DATABASE_URL in .env or pass it as first arg.');
  process.exit(1);
}

async function main() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    for (const name of categories) {
      const exists = await Category.findOne({ name });
      if (exists) {
        console.log(`Skipped (exists): ${name}`);
        continue;
      }

      const description = `${name} courses`;
      const cat = await Category.create({ name, description });
      console.log(`Created: ${name} (id: ${cat._id})`);
    }

    console.log('Bulk insert finished.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error inserting categories:', err.message || err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
}

main();
