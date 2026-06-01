-- Enable necessary extensions
create extension if not exists "postgis" with schema "extensions";
-- Note: pg_cron is usually enabled via the Supabase dashboard in production, but we can try creating it here.
-- create extension if not exists "pg_cron" with schema "extensions";

-- 1. Create Roles Enum
create type user_role as enum ('user', 'admin', 'superadmin');
create type ticket_status as enum ('Pending', 'Assigned', 'In Progress', 'Pending Verification', 'Resolved');
create type escalation_tier as enum ('L1', 'L2', 'L3', 'L4');

-- 2. User Profiles Table
create table public.user_profiles (
  id uuid primary key references auth.users on delete cascade,
  phone_number text unique,
  email text unique,
  role user_role default 'user'::user_role,
  reputation_score integer default 100,
  is_banned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Departments Table
create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  escalation_level escalation_tier default 'L1'::escalation_tier,
  -- PostGIS Polygon representing the ward/jurisdiction boundary
  jurisdiction_polygon geometry(Polygon, 4326),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tickets Table
create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.user_profiles(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  category text not null,
  severity integer check (severity >= 1 and severity <= 10),
  description text not null,
  address text,
  status ticket_status default 'Pending'::ticket_status,
  image_url text,
  ai_review text,
  -- PostGIS Point for spatial queries
  location geometry(Point, 4326),
  -- Simple lat/lng for easy frontend access
  lat numeric not null,
  lng numeric not null,
  escalation_level escalation_tier default 'L1'::escalation_tier,
  upvotes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sla_breach_date timestamp with time zone default (timezone('utc'::text, now()) + interval '7 days')
);

-- 5. Ticket Upvotes Table (Many-to-Many)
create table public.ticket_upvotes (
  ticket_id uuid references public.tickets(id) on delete cascade,
  user_id uuid references public.user_profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (ticket_id, user_id)
);

-- Indexes for performance
create index idx_tickets_location on public.tickets using gist (location);
create index idx_departments_polygon on public.departments using gist (jurisdiction_polygon);

-- 6. Row Level Security (RLS)
alter table public.user_profiles enable row level security;
alter table public.departments enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_upvotes enable row level security;

-- Policies for user_profiles
create policy "Public profiles are viewable by everyone." on public.user_profiles for select using (true);
create policy "Users can insert their own profile." on public.user_profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.user_profiles for update using (auth.uid() = id);

-- Policies for departments
create policy "Departments are viewable by everyone." on public.departments for select using (true);

-- Policies for tickets
create policy "Tickets are viewable by everyone." on public.tickets for select using (true);
create policy "Anyone can create tickets." on public.tickets for insert with check (true);
create policy "Admins can update tickets." on public.tickets for update using (
  exists (
    select 1 from public.user_profiles
    where user_profiles.id = auth.uid() and (user_profiles.role = 'admin' or user_profiles.role = 'superadmin')
  )
);

-- Policies for ticket upvotes
create policy "Upvotes are viewable by everyone." on public.ticket_upvotes for select using (true);
create policy "Authenticated users can upvote." on public.ticket_upvotes for insert with check (auth.uid() = user_id);
create policy "Authenticated users can remove their upvote." on public.ticket_upvotes for delete using (auth.uid() = user_id);

-- 7. Trigger to automatically assign tickets to departments based on location
create or replace function public.auto_assign_department()
returns trigger as $$
begin
  -- Automatically build PostGIS location from lat and lng
  if new.location is null then
    new.location := ST_SetSRID(ST_MakePoint(new.lng, new.lat), 4326);
  end if;

  -- Find the department whose jurisdiction polygon contains the ticket's location
  select id into new.department_id
  from public.departments
  where st_contains(jurisdiction_polygon, new.location)
  limit 1;
  
  return new;
end;
$$ language plpgsql security definer;

create trigger tr_auto_assign_department
before insert on public.tickets
for each row
execute function public.auto_assign_department();

-- 8. Trigger to prevent spam (more than 10 tickets per day)
create or replace function public.check_spam_limit()
returns trigger as $$
declare
  ticket_count integer;
begin
  select count(*) into ticket_count
  from public.tickets
  where reporter_id = new.reporter_id
  and created_at >= (now() - interval '24 hours');
  
  if ticket_count >= 10 then
    -- Flag user as banned
    update public.user_profiles set is_banned = true where id = new.reporter_id;
    raise exception 'Spam limit exceeded: User is banned from submitting more tickets.';
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

create trigger tr_check_spam_limit
before insert on public.tickets
for each row
execute function public.check_spam_limit();
