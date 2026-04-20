/**
 * Seed Script - Creates Admin User
 * 
 * This script checks if an admin user exists in Supabase.
 * If not, it creates one with the credentials from environment variables.
 * 
 * Usage:
 * 1. Update .env.local with VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD
 * 2. Run: npx tsx src/seed.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const adminEmail = process.env.VITE_ADMIN_EMAIL || 'admin@joyfulhub.com';
const adminPassword = process.env.VITE_ADMIN_PASSWORD || 'Admin@123456';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedAdmin() {
  console.log('🌱 Seeding admin user...');
  console.log(`📧 Email: ${adminEmail}`);
  
  try {
    // Try to sign in first to check if user exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (signInData?.user) {
      console.log('✅ Admin user already exists!');
      console.log(`👤 User ID: ${signInData.user.id}`);
      console.log(`📧 Email: ${signInData.user.email}`);
      return;
    }

    if (signInError && signInError.message.includes('Invalid login credentials')) {
      // User doesn't exist or wrong password - try to create
      console.log('📝 Creating new admin user...');
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
      });

      if (signUpError) {
        console.error('❌ Error creating admin user:', signUpError.message);
        process.exit(1);
      }

      if (signUpData?.user) {
        console.log('✅ Admin user created successfully!');
        console.log(`👤 User ID: ${signUpData.user.id}`);
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: ${adminPassword}`);
        console.log('\n⚠️  IMPORTANT: Save these credentials securely!');
        console.log('   You can change the password later from Supabase dashboard if needed.');
      }
    } else if (signInError) {
      console.error('❌ Error signing in:', signInError.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

seedAdmin();
