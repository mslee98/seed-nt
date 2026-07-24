-- Auth P0/P1: nickname 필수화 + 패스키 UX·복구 쿨다운 메타
-- WARNING: Apply against existing user_profiles. Adjust IF NOT EXISTS as needed.

-- nickname: 가입 시 필수·UNIQUE (기존 NULL 행은 백필 후 NOT NULL)
ALTER TABLE public.user_profiles
  ALTER COLUMN nickname SET NOT NULL;

-- 패스키 유도 UX (인증 근거 아님 — list()가 source of truth)
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS passkey_registered_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS passkey_prompt_dismissed_at timestamp with time zone;

-- P1 복구 후 민감 기능 제한
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS last_recovery_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS sensitive_actions_locked_until timestamp with time zone;

COMMENT ON COLUMN public.user_profiles.passkey_registered_at IS
  'First passkey registered (UX). Source of truth: auth.passkey.list()';
COMMENT ON COLUMN public.user_profiles.passkey_prompt_dismissed_at IS
  'User dismissed signup/login passkey prompt';
COMMENT ON COLUMN public.user_profiles.last_recovery_at IS
  'Account recovery completed at';
COMMENT ON COLUMN public.user_profiles.sensitive_actions_locked_until IS
  'Block account change / high-value / PIN change until this time';
