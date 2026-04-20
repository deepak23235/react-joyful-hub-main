-- ==========================================
-- STEP 2: Seed Sample Data (Optional)
-- Run this AFTER creating schema
-- ==========================================
-- URL: https://supabase.com/dashboard/project/sjmmvksyesuidgxkumbr/sql
-- ==========================================

-- Insert Locations
insert into locations (id, name, slug, image, description) values
  ('11111111-1111-1111-1111-111111111111', 'Delhi', 'delhi', 
   'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80', 
   'Explore models available in the capital city of India.'),
  ('22222222-2222-2222-2222-222222222222', 'Mumbai', 'mumbai', 
   'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80', 
   'Discover offerings across the financial capital.'),
  ('33333333-3333-3333-3333-333333333333', 'Bangalore', 'bangalore', 
   'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80', 
   'Browse models in India''s tech hub.');

-- Insert Areas
insert into areas (id, location_id, name, slug, image, description) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 
   'Rajiv Chowk', 'rajiv-chowk',
   'https://images.unsplash.com/photo-1515091943-dd2ab4ef3eb4?w=800&q=80', 
   'Central hub of Delhi with multiple model options.'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 
   'Connaught Place', 'connaught-place',
   'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80', 
   'Premium area in the heart of New Delhi.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 
   'Andheri', 'andheri',
   'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80', 
   'Popular suburb in Mumbai with wide range of models.'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 
   'Whitefield', 'whitefield',
   'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80', 
   'IT corridor of Bangalore.');

-- Insert Models
insert into models (id, area_id, name, slug, image, images, short_description, description, phone_number, features, specifications) values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'Alpha Pro', 'alpha-pro',
   'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
   ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'],
   'Premium model with top-tier features and specifications.',
   'The Alpha Pro is our flagship offering, featuring cutting-edge technology and premium build quality.',
   '+919876543210',
   ARRAY['Premium Build', '24/7 Support', 'Custom Options', 'Extended Warranty'],
   '{"Type": "Premium", "Year": "2024", "Condition": "New", "Warranty": "5 Years"}'::jsonb),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'Beta Standard', 'beta-standard',
   'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
   ARRAY['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80'],
   'Reliable standard model with great value.',
   'The Beta Standard offers excellent value with reliable performance and quality build.',
   '+919876543210',
   ARRAY['Reliable Performance', 'Great Value', 'Standard Support'],
   '{"Type": "Standard", "Year": "2024", "Condition": "New", "Warranty": "3 Years"}'::jsonb),
  ('10101010-1010-1010-1010-101010101010', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
   'Gamma Elite', 'gamma-elite',
   'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
   ARRAY['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'],
   'Elite model for discerning customers.',
   'Gamma Elite is designed for those who demand the best. Unmatched performance and luxury combined.',
   '+919876543210',
   ARRAY['Elite Performance', 'Luxury Finish', 'Priority Support', 'Custom Design'],
   '{"Type": "Elite", "Year": "2025", "Condition": "New", "Warranty": "7 Years"}'::jsonb);

-- ==========================================
-- ✅ Sample data seeded!
-- ==========================================
