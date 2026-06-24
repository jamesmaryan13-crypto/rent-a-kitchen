-- ============================================================
-- Rent a Kitchen — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- Extends auth.users — auto-created on signup via trigger
-- ============================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null default 'chef' check (role in ('chef', 'owner', 'admin')),
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  bio text,
  business_name text,
  abn text,
  suburb text,
  state text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, first_name, last_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'chef'),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================================
-- KITCHENS
-- ============================================================
create table public.kitchens (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  suburb text,
  state text,
  address text,
  lat numeric(9,6),
  lng numeric(9,6),
  description text,
  hourly_rate numeric(10,2) not null,
  capacity integer default 1,
  equipment text[] default '{}',
  certifications text[] default '{}',
  photos text[] default '{}',
  amenities jsonb default '{}',
  status text default 'active' check (status in ('active', 'paused', 'draft')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.kitchens enable row level security;

create policy "Anyone can view active kitchens"
  on public.kitchens for select
  using (status = 'active' or owner_id = auth.uid());

create policy "Owners can insert kitchens"
  on public.kitchens for insert
  with check (owner_id = auth.uid());

create policy "Owners can update own kitchens"
  on public.kitchens for update
  using (owner_id = auth.uid());

create policy "Owners can delete own kitchens"
  on public.kitchens for delete
  using (owner_id = auth.uid());

-- ============================================================
-- BOOKINGS
-- ============================================================
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  kitchen_id uuid references public.kitchens(id) on delete cascade not null,
  chef_id uuid references public.profiles(id) on delete cascade not null,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  hours numeric(4,1) not null,
  total_price numeric(10,2) not null,
  status text default 'pending'
    check (status in ('pending', 'confirmed', 'declined', 'cancelled', 'awaiting-review', 'issue-reported', 'completed')),
  chef_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.bookings enable row level security;

create policy "Chefs can view own bookings"
  on public.bookings for select
  using (chef_id = auth.uid());

create policy "Owners can view bookings for their kitchens"
  on public.bookings for select
  using (owner_id = auth.uid());

create policy "Chefs can create bookings"
  on public.bookings for insert
  with check (chef_id = auth.uid());

create policy "Chefs can cancel own bookings"
  on public.bookings for update
  using (chef_id = auth.uid());

create policy "Owners can update bookings"
  on public.bookings for update
  using (owner_id = auth.uid());

-- ============================================================
-- BOOKING CHECK-IN/OUT STATES
-- ============================================================
create table public.booking_states (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) on delete cascade unique not null,
  checked_in_at timestamptz,
  check_in_note text,
  checked_out_at timestamptz,
  checkout_rating integer check (checkout_rating between 1 and 5),
  checkout_notes text,
  checkout_checklist jsonb,
  owner_confirmed_at timestamptz,
  owner_issue jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.booking_states enable row level security;

create policy "Booking parties can view check-in state"
  on public.booking_states for select
  using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and (b.chef_id = auth.uid() or b.owner_id = auth.uid())
    )
  );

create policy "Booking parties can insert check-in state"
  on public.booking_states for insert
  with check (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and (b.chef_id = auth.uid() or b.owner_id = auth.uid())
    )
  );

create policy "Booking parties can update check-in state"
  on public.booking_states for update
  using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and (b.chef_id = auth.uid() or b.owner_id = auth.uid())
    )
  );

-- ============================================================
-- MESSAGE THREADS
-- ============================================================
create table public.message_threads (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id),
  chef_id uuid references public.profiles(id) not null,
  owner_id uuid references public.profiles(id) not null,
  created_at timestamptz default now()
);

alter table public.message_threads enable row level security;

create policy "Thread participants can view threads"
  on public.message_threads for select
  using (chef_id = auth.uid() or owner_id = auth.uid());

create policy "Thread participants can create threads"
  on public.message_threads for insert
  with check (chef_id = auth.uid() or owner_id = auth.uid());

-- ============================================================
-- MESSAGES
-- ============================================================
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  thread_id uuid references public.message_threads(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) not null,
  content text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "Thread participants can view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.message_threads t
      where t.id = thread_id
        and (t.chef_id = auth.uid() or t.owner_id = auth.uid())
    )
  );

create policy "Thread participants can send messages"
  on public.messages for insert
  with check (
    sender_id = auth.uid() and
    exists (
      select 1 from public.message_threads t
      where t.id = thread_id
        and (t.chef_id = auth.uid() or t.owner_id = auth.uid())
    )
  );

-- ============================================================
-- SAVED LISTINGS
-- ============================================================
create table public.saved_listings (
  id uuid default uuid_generate_v4() primary key,
  chef_id uuid references public.profiles(id) on delete cascade not null,
  kitchen_id uuid references public.kitchens(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(chef_id, kitchen_id)
);

alter table public.saved_listings enable row level security;

create policy "Chefs can manage own saved listings"
  on public.saved_listings for all
  using (chef_id = auth.uid());

-- ============================================================
-- CREDENTIALS
-- ============================================================
create table public.credentials (
  id uuid default uuid_generate_v4() primary key,
  chef_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  file_url text,
  file_name text,
  verified boolean default false,
  uploaded_at timestamptz default now()
);

alter table public.credentials enable row level security;

create policy "Chefs can manage own credentials"
  on public.credentials for all
  using (chef_id = auth.uid());

create policy "Owners can view credentials of chefs who booked their kitchen"
  on public.credentials for select
  using (
    exists (
      select 1 from public.bookings b
        join public.kitchens k on k.id = b.kitchen_id
        where b.chef_id = credentials.chef_id
          and k.owner_id = auth.uid()
    )
  );

-- ============================================================
-- BLOCKED DATES
-- ============================================================
create table public.blocked_dates (
  id uuid default uuid_generate_v4() primary key,
  kitchen_id uuid references public.kitchens(id) on delete cascade not null,
  date date not null,
  reason text,
  created_at timestamptz default now(),
  unique(kitchen_id, date)
);

alter table public.blocked_dates enable row level security;

create policy "Anyone can view blocked dates"
  on public.blocked_dates for select
  using (true);

create policy "Owners can manage blocked dates for own kitchens"
  on public.blocked_dates for all
  using (
    exists (
      select 1 from public.kitchens k
      where k.id = kitchen_id and k.owner_id = auth.uid()
    )
  );

-- ============================================================
-- REVIEWS
-- ============================================================
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) on delete cascade unique not null,
  kitchen_id uuid references public.kitchens(id) on delete cascade not null,
  chef_id uuid references public.profiles(id) not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

alter table public.reviews enable row level security;

create policy "Anyone can view reviews"
  on public.reviews for select
  using (true);

create policy "Chefs can create reviews for own completed bookings"
  on public.reviews for insert
  with check (
    chef_id = auth.uid() and
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.chef_id = auth.uid()
        and b.status in ('completed', 'awaiting-review')
    )
  );

-- ============================================================
-- STORAGE BUCKETS
-- Run these in the Supabase Storage section or via the dashboard
-- ============================================================
-- bucket: kitchen-photos (public)
-- bucket: credential-docs (private)
-- bucket: avatars (public)

-- ============================================================
-- DONE
-- ============================================================
