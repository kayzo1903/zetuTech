-- Create product status enum
CREATE TYPE product_status AS ENUM (
  'Brand New', 
  'Refurbished', 
  'Used-Like New', 
  'Used-Good', 
  'Used-Fair'
);

-- Create product category enum
CREATE TYPE product_category AS ENUM (
  'Ultrabooks',
  'Gaming Laptops',
  'Business Laptops',
  'Budget Laptops',
  '2-in-1 Convertibles',
  'Chromebooks',
  'Workstation Laptops',
  'Student Laptops',
  'Creative/Design Laptops',
  'Thin and Light Laptops',
  'MacBooks',
  'Gaming Ultrabooks',
  'Rugged Laptops',
  'Netbooks',
  'Refurbished Laptops'
);

-- Create products table
CREATE TABLE products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  
  -- Pricing
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  
  -- Inventory
  stock INTEGER NOT NULL DEFAULT 0,
  
  -- Product details
  status product_status NOT NULL DEFAULT 'Brand New',
  is_new BOOLEAN NOT NULL DEFAULT false,
  
  -- Technical specifications
  processor TEXT NOT NULL,
  ram TEXT NOT NULL,
  storage TEXT NOT NULL,
  graphics TEXT NOT NULL,
  display TEXT NOT NULL,
  warranty TEXT NOT NULL,
  
  -- Additional data
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  categories JSONB NOT NULL DEFAULT '[]'::jsonb,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- SEO and metadata
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  
  -- Status flags
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Foreign keys
  created_by TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

-- Create product categories junction table
CREATE TABLE product_categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category product_category NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create product images table
CREATE TABLE product_images (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_by ON products(created_by);
CREATE INDEX idx_products_categories ON products USING GIN(categories);
CREATE INDEX idx_products_specs ON products USING GIN(specs);

CREATE INDEX idx_product_categories_product_id ON product_categories(product_id);
CREATE INDEX idx_product_categories_category ON product_categories(category);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_is_primary ON product_images(is_primary);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
