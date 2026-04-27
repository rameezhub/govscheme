const mongoose = require('mongoose');
const dotenv   = require('dotenv');

dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

const connectDB   = require('../config/db');
const Scheme      = require('../models/Scheme');
const User        = require('../models/User');
const schemesData = require('./schemes.data');

const seed = async () => {
  await connectDB();
  const action = process.argv[2];
  if (action === '--delete') {
    await destroyData();
  } else {
    await importData();
  }
};

const importData = async () => {
  try {
    console.log('\n📦 Starting database seed...\n');

    await Scheme.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ── Admin user ───────────────────────────────────────────────────────────
    const adminUser = await User.create({
      name: 'System Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@govtschemes.in',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
      age: 35, gender: 'male', annualIncome: 800000,
      occupation: 'salaried', state: 'Delhi', category: 'General',
      educationLevel: 'post_graduate', preferredLanguage: 'en'
    });
    console.log(`✅ Admin user: ${adminUser.email}`);

    // ── Demo users — varied state + gender for testing filters ───────────────
    const sampleUsers = [
      {
        name: 'Ramesh Kumar',       email: 'ramesh.farmer@test.com',
        password: 'Test@1234',      age: 38, gender: 'male',
        annualIncome: 85000,        occupation: 'farmer',
        state: 'Uttar Pradesh',     category: 'OBC',
        educationLevel: 'primary',  preferredLanguage: 'hi'
      },
      {
        name: 'Priya Sharma',       email: 'priya.student@test.com',
        password: 'Test@1234',      age: 20, gender: 'female',
        annualIncome: 180000,       occupation: 'student',
        state: 'Maharashtra',       category: 'SC',
        educationLevel: 'higher_secondary', preferredLanguage: 'mr'
      },
      {
        name: 'Suresh Babu',        email: 'suresh.self@test.com',
        password: 'Test@1234',      age: 32, gender: 'male',
        annualIncome: 240000,       occupation: 'self-employed',
        state: 'Tamil Nadu',        category: 'General',
        educationLevel: 'secondary', preferredLanguage: 'ta'
      },
      {
        name: 'Lakshmi Devi',       email: 'lakshmi.homemaker@test.com',
        password: 'Test@1234',      age: 28, gender: 'female',
        annualIncome: 120000,       occupation: 'homemaker',
        state: 'Karnataka',         category: 'ST',
        educationLevel: 'primary',  preferredLanguage: 'kn'
      },
      {
        name: 'Gurpreet Singh',     email: 'gurpreet.farmer@test.com',
        password: 'Test@1234',      age: 45, gender: 'male',
        annualIncome: 95000,        occupation: 'farmer',
        state: 'Punjab',            category: 'General',
        educationLevel: 'secondary', preferredLanguage: 'pa'
      },
      {
        name: 'Anjali Verma',       email: 'anjali.student@test.com',
        password: 'Test@1234',      age: 16, gender: 'female',
        annualIncome: 110000,       occupation: 'student',
        state: 'West Bengal',       category: 'General',
        educationLevel: 'secondary', preferredLanguage: 'en'
      },
      {
        name: 'Ratan Lal',          email: 'ratan.retired@test.com',
        password: 'Test@1234',      age: 67, gender: 'male',
        annualIncome: 60000,        occupation: 'retired',
        state: 'Rajasthan',         category: 'SC',
        educationLevel: 'primary',  preferredLanguage: 'hi'
      },
      {
        name: 'Meena Kumari',       email: 'meena.farmer@test.com',
        password: 'Test@1234',      age: 35, gender: 'female',
        annualIncome: 75000,        occupation: 'farmer',
        state: 'Chhattisgarh',      category: 'ST',
        educationLevel: 'primary',  preferredLanguage: 'hi'
      }
    ];

    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ ${createdUsers.length} demo users created`);

    // ── Seed Schemes ─────────────────────────────────────────────────────────
    const schemesWithCreator = schemesData.map(s => ({ ...s, createdBy: adminUser._id }));
    const createdSchemes = await Scheme.insertMany(schemesWithCreator);
    console.log(`✅ ${createdSchemes.length} government schemes seeded`);

    // ── Print summary ─────────────────────────────────────────────────────────
    // Group schemes by state coverage
    const allIndia   = schemesData.filter(s => s.eligibility.allowedStates.includes('All'));
    const stateSpec  = schemesData.filter(s => !s.eligibility.allowedStates.includes('All'));
    const femaleOnly = schemesData.filter(s =>
      s.eligibility.allowedGenders.length === 1 &&
      s.eligibility.allowedGenders.includes('female')
    );
    const allGender  = schemesData.filter(s => s.eligibility.allowedGenders.includes('All'));

    console.log('\n════════════════════════════════════════════════');
    console.log('📊 SEED SUMMARY');
    console.log('════════════════════════════════════════════════');
    console.log(`👤 Admin:            ${adminUser.email} / ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log(`👥 Demo Users:       ${createdUsers.length}`);
    console.log(`📋 Total Schemes:    ${createdSchemes.length}`);
    console.log(`🇮🇳 All India:        ${allIndia.length}`);
    console.log(`📍 State-specific:   ${stateSpec.length}`);
    console.log(`👩 Female-only:      ${femaleOnly.length}`);
    console.log(`👥 All Genders:      ${allGender.length}`);
    console.log('\n🧪 DEMO USER CREDENTIALS (all use password: Test@1234)');
    sampleUsers.forEach(u => {
      console.log(`   ${u.email.padEnd(35)} (${u.gender}, ${u.state})`);
    });
    console.log('════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    if (error.errors) console.error(JSON.stringify(error.errors, null, 2));
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Scheme.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  All data destroyed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seed();
