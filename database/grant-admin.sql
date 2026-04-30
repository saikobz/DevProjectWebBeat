-- Grant admin (profiles.is_admin = true)
-- รันใน Supabase Dashboard → SQL Editor (postgres bypass RLS)
--
-- ข้อบังคับก่อนรันไฟล์นี้:
-- • ต้องมีตาราง public.profiles (ปกติจาก database/schema.sql ครั้งแรกบนโปรเจกต์ว่าง)
-- • ถ้ารัน schema.sql ซ้ำแล้วขึ้น type "beat_genre" already exists แต่ยังไม่มี profiles
--   ให้รัน database/ensure-profiles.sql ก่อน แล้วค่อยรันไฟล์นี้
--
-- ขั้นตอน:
-- 1) บัญชีนี้ต้องมีใน Supabase Auth (auth.users) แล้ว
-- 2) รันทั้งไฟล์ใน SQL Editor แล้วเช็กผลใน SELECT ด้านล่าง
--
-- อีเมล admin (เปลี่ยนในไฟล์นี้ได้ถ้าต้องการคนอื่น)

do $$
begin
  if not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'profiles'
  ) then
    raise exception 'public.profiles missing: on a fresh project run database/schema.sql once. If enums already exist but profiles is missing (partial run), run database/ensure-profiles.sql then grant-admin.sql again.';
  end if;
end $$;

begin;

insert into public.profiles (id, email, display_name, is_admin)
select
  u.id,
  coalesce(u.email, ''),
  coalesce(u.raw_user_meta_data ->> 'display_name', ''),
  true
from auth.users u
where lower(trim(u.email)) = lower(trim('saikobz@gmail.com'))
on conflict (id) do update set is_admin = true;

commit;

-- ตรวจสอบ (ควรได้ is_admin = true)
select p.id, p.email, p.display_name, p.is_admin
from public.profiles p
join auth.users u on u.id = p.id
where lower(trim(u.email)) = lower(trim('saikobz@gmail.com'));

-- -----------------------------------------------------------------------------
-- ทางเลือก: ระบุด้วย UUID จาก Authentication → Users (ถ้ารู้ id ชัดเจน)
-- -----------------------------------------------------------------------------
-- update public.profiles set is_admin = true where id = '00000000-0000-0000-0000-000000000000';
--
-- ถ้ายังไม่มีแถวใน profiles (เช่น สร้าง user ก่อนมี trigger):
-- insert into public.profiles (id, email, display_name, is_admin)
-- select id, coalesce(email, ''), coalesce(raw_user_meta_data ->> 'display_name', ''), true
-- from auth.users
-- where id = '00000000-0000-0000-0000-000000000000'
-- on conflict (id) do update set is_admin = true;
