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
    'streamLimit', stream_limit,
    'monetization', monetization,
    'musicVideo', music_video,
    'livePerformance', true,
    'stemsIncluded', stems_included,
    'creditRequired', true,
    'exclusive', exclusive,
    'publishingSplit', jsonb_build_object('licensee', 50, 'producer', 50),
    'masterRights', jsonb_build_object(
      'beatMasterOwner', 'producer',
      'finalSongMasterOwner', 'licensee',
      'transferBeatMaster', false
    ),
    'files', files
  )
from public.beats b
cross join (
  values
    ('basic', 399, 5000, false, false, false, false, to_jsonb(array['MP3 untagged']::text[])),
    ('premium', 999, 50000, true, true, false, false, to_jsonb(array['WAV', 'MP3 untagged']::text[])),
    ('trackout', 2499, 100000, true, true, true, false, to_jsonb(array['WAV', 'MP3 untagged', 'Stems']::text[])),
    ('exclusive', 12000, null, true, true, true, true, to_jsonb(array['WAV', 'MP3 untagged', 'Stems']::text[]))
) as licenses(tier, price, stream_limit, monetization, music_video, stems_included, exclusive, files)
on conflict (beat_id, tier) do nothing;
