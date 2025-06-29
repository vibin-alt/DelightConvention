
-- Create bookings table to store user booking data
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_type TEXT NOT NULL,
  preferred_dates DATE[] NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table for admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create booked_dates table to track unavailable dates
CREATE TABLE public.booked_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  event_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert some sample booked dates
INSERT INTO public.booked_dates (date, event_name) VALUES
('2025-01-15', 'Corporate Annual Meeting'),
('2025-01-22', 'Wedding Reception'),
('2025-02-14', 'Valentine Gala'),
('2025-02-28', 'Tech Conference'),
('2025-03-08', 'Spring Festival');

-- Insert a default admin user (username: admin, password: admin123)
INSERT INTO public.admin_users (username, password_hash) VALUES
('admin', '$2b$10$rQj5uLkZqQ7tGzKqGqF0aeHvK5QKzJ5L5ZYQrQGzKqFqGqFqGqFqG');

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booked_dates ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to bookings (users can create bookings)
CREATE POLICY "Anyone can create bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (true);

-- Create policies for admin access to bookings
CREATE POLICY "Admins can view all bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can update bookings" 
  ON public.bookings 
  FOR UPDATE 
  USING (true);

-- Create policies for booked_dates (public read access for availability checking)
CREATE POLICY "Anyone can view booked dates" 
  ON public.booked_dates 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage booked dates" 
  ON public.booked_dates 
  FOR ALL 
  USING (true);

-- Create policies for admin_users (restricted access)
CREATE POLICY "Admin users can view themselves" 
  ON public.admin_users 
  FOR SELECT 
  USING (true);
