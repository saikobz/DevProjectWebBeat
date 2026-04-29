insert into public.beats (
  id, slug, title, description, bpm, key, genre, mood, tags, duration_sec,
  preview_url, wav_path, stems_path, status, cover_url, is_featured, sale_count, published_at
) values
(
  '00000000-0000-0000-0000-000000000001',
  'dark-trap-140-cmin',
  'Midnight Trap',
  'บีท Trap โทนมืด 808 หนัก เหมาะกับ hook ดุดันและ verse เร็ว',
  140,
  'C minor',
  'trap',
  array['dark', 'aggressive'],
  array['808', 'thai rap', 'club'],
  168,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'private/wav/dark-trap-140-cmin.wav',
  'private/stems/dark-trap-140-cmin.zip',
  'published',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&auto=format&fit=crop',
  true,
  12,
  now()
),
(
  '00000000-0000-0000-0000-000000000002',
  'rnb-late-night-92-amin',
  'Late Night Calls',
  'R&B นุ่ม ๆ มี electric piano และ bass อุ่นสำหรับเพลงรักกลางคืน',
  92,
  'A minor',
  'rnb',
  array['smooth', 'romantic'],
  array['rnb', 'slow jam', 'vocal'],
  191,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'private/wav/rnb-late-night-92-amin.wav',
  'private/stems/rnb-late-night-92-amin.zip',
  'published',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=900&auto=format&fit=crop',
  true,
  7,
  now()
);

insert into public.beat_licenses (beat_id, tier, price_thb, terms)
select
  b.id,
  tier::license_tier,
  price,
  jsonb_build_object(
    'stream_limit', stream_limit,
    'monetization', monetization,
    'music_video', music_video,
    'stems_included', stems_included,
    'credit_required', true
  )
from public.beats b
cross join (
  values
    ('basic', 399, 5000, false, false, false),
    ('premium', 999, 50000, true, true, false),
    ('trackout', 2499, 100000, true, true, true),
    ('exclusive', 12000, null, true, true, true)
) as licenses(tier, price, stream_limit, monetization, music_video, stems_included)
on conflict (beat_id, tier) do nothing;
