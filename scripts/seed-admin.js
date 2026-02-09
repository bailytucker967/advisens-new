/**
 * Create the first admin user.
 * Edit the email and password below, then run: node scripts/seed-admin.js
 *   or: npm run seed:admin
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Edit these before running
const email = 'admin@advisens.com';
const password = 'admin123';

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('Set MONGODB_URI in .env.local');
  process.exit(1);
}

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function seed() {
  await mongoose.connect(mongoUri);
  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log('Admin already exists:', email);
    await mongoose.disconnect();
    process.exit(0);
  }
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  await Admin.create({ email: email.toLowerCase(), password: hashed, role: 'admin' });
  console.log('Admin created:', email);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
