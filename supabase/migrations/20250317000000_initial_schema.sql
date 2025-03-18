-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  address TEXT,
  category TEXT,
  social_media JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE
);

-- Create creators table
CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  bio TEXT,
  profile_pic_url TEXT,
  content_categories TEXT[],
  audience_metrics JSONB,
  social_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE
);

-- Create social_accounts table
CREATE TABLE IF NOT EXISTS social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES creators(id),
  platform TEXT NOT NULL,
  username TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  metrics JSONB,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(creator_id, platform)
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id),
  title TEXT NOT NULL,
  description TEXT,
  objectives TEXT[],
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  budget DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'draft',
  rules JSONB,
  requirements JSONB,
  metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create participations table
CREATE TABLE IF NOT EXISTS participations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id),
  creator_id UUID NOT NULL REFERENCES creators(id),
  status TEXT NOT NULL DEFAULT 'pending',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  content_links TEXT[],
  metrics JSONB,
  coupon_code TEXT,
  earnings DECIMAL(10,2) DEFAULT 0,
  UNIQUE(campaign_id, creator_id)
);

-- Create content_posts table
CREATE TABLE IF NOT EXISTS content_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participation_id UUID NOT NULL REFERENCES participations(id),
  platform TEXT NOT NULL,
  content_url TEXT NOT NULL,
  posted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  metrics JSONB,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  participation_id UUID NOT NULL REFERENCES participations(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  used_by TEXT,
  value DECIMAL(10,2),
  metadata JSONB
);

-- Create coupon_redemptions table
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES coupons(id),
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location TEXT,
  value DECIMAL(10,2),
  metadata JSONB
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create creator_balances table
CREATE TABLE IF NOT EXISTS creator_balances (
  creator_id UUID PRIMARY KEY REFERENCES creators(id),
  available_balance DECIMAL(10,2) DEFAULT 0,
  pending_balance DECIMAL(10,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES creators(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method JSONB,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id),
  campaign_id UUID REFERENCES campaigns(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create communication_templates table
CREATE TABLE IF NOT EXISTS communication_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  variables JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create automation_rules table
CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  event TEXT NOT NULL,
  conditions JSONB,
  actions JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL,
  permissions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies

-- Brands can only see and edit their own data
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands can view their own data" 
  ON brands FOR SELECT 
  USING (id = auth.uid());

CREATE POLICY "Brands can update their own data" 
  ON brands FOR UPDATE 
  USING (id = auth.uid());

-- Creators can only see and edit their own data
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view their own data" 
  ON creators FOR SELECT 
  USING (id = auth.uid());

CREATE POLICY "Creators can update their own data" 
  ON creators FOR UPDATE 
  USING (id = auth.uid());

-- Campaigns policies
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands can view their own campaigns" 
  ON campaigns FOR SELECT 
  USING (brand_id = auth.uid());

CREATE POLICY "Brands can insert their own campaigns" 
  ON campaigns FOR INSERT 
  WITH CHECK (brand_id = auth.uid());

CREATE POLICY "Brands can update their own campaigns" 
  ON campaigns FOR UPDATE 
  USING (brand_id = auth.uid());

CREATE POLICY "Creators can view active campaigns" 
  ON campaigns FOR SELECT 
  USING (status = 'active');

-- Participations policies
ALTER TABLE participations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands can view participations for their campaigns" 
  ON participations FOR SELECT 
  USING (
    campaign_id IN (
      SELECT id FROM campaigns WHERE brand_id = auth.uid()
    )
  );

CREATE POLICY "Creators can view their own participations" 
  ON participations FOR SELECT 
  USING (creator_id = auth.uid());

CREATE POLICY "Creators can insert their own participations" 
  ON participations FOR INSERT 
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators can update their own participations" 
  ON participations FOR UPDATE 
  USING (creator_id = auth.uid());

-- Content posts policies
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands can view content posts for their campaigns" 
  ON content_posts FOR SELECT 
  USING (
    participation_id IN (
      SELECT p.id FROM participations p
      JOIN campaigns c ON p.campaign_id = c.id
      WHERE c.brand_id = auth.uid()
    )
  );

CREATE POLICY "Creators can view their own content posts" 
  ON content_posts FOR SELECT 
  USING (
    participation_id IN (
      SELECT id FROM participations WHERE creator_id = auth.uid()
    )
  );

CREATE POLICY "Creators can insert their own content posts" 
  ON content_posts FOR INSERT 
  WITH CHECK (
    participation_id IN (
      SELECT id FROM participations WHERE creator_id = auth.uid()
    )
  );

CREATE POLICY "Creators can update their own content posts" 
  ON content_posts FOR UPDATE 
  USING (
    participation_id IN (
      SELECT id FROM participations WHERE creator_id = auth.uid()
    )
  );

-- Admin policies (admins can see everything)
CREATE POLICY "Admins can view all brands" 
  ON brands FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM admins
    )
  );

CREATE POLICY "Admins can view all creators" 
  ON creators FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM admins
    )
  );

CREATE POLICY "Admins can view all campaigns" 
  ON campaigns FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM admins
    )
  );

CREATE POLICY "Admins can view all participations" 
  ON participations FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM admins
    )
  );

CREATE POLICY "Admins can view all content posts" 
  ON content_posts FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM admins
    )
  );

-- Create functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at timestamp
CREATE TRIGGER update_brands_updated_at
BEFORE UPDATE ON brands
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creators_updated_at
BEFORE UPDATE ON creators
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
BEFORE UPDATE ON campaigns
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_posts_updated_at
BEFORE UPDATE ON content_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communication_templates_updated_at
BEFORE UPDATE ON communication_templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_rules_updated_at
BEFORE UPDATE ON automation_rules
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
