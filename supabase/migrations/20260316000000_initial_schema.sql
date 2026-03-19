-- Enable Row Level Security
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reservations ENABLE ROW LEVEL SECURITY;

-- Profiles Table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Hotels Table
CREATE TABLE public.hotels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    amenities TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    stars INTEGER DEFAULT 3 CHECK (stars >= 1 AND stars <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Rooms Table
CREATE TABLE public.rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hotel_id UUID REFERENCES public.hotels ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    capacity INTEGER DEFAULT 2 NOT NULL,
    base_price NUMERIC NOT NULL, -- Real price of the hotel
    margin NUMERIC DEFAULT 0 NOT NULL, -- Platform margin
    total_price NUMERIC GENERATED ALWAYS AS (base_price + margin) STORED, -- Price displayed to client
    description TEXT,
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reservations Table
CREATE TABLE public.reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles ON DELETE SET NULL,
    hotel_id UUID REFERENCES public.hotels ON DELETE CASCADE NOT NULL,
    room_id UUID REFERENCES public.rooms ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price NUMERIC NOT NULL, -- The price paid by the client (total_price * nights)
    platform_profit NUMERIC NOT NULL, -- (margin * nights)
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Policies (Simplified for now, will be refined in Phase 2)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Hotels are viewable by everyone." ON public.hotels FOR SELECT USING (true);
CREATE POLICY "Rooms are viewable by everyone." ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Reservations are viewable by owner or admin." ON public.reservations FOR SELECT 
USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
