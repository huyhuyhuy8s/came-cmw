
-- Function to check if an email exists in the auth.users table
CREATE OR REPLACE FUNCTION public.check_email_exists(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  email_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO email_count FROM auth.users WHERE email = email_to_check;
  RETURN email_count > 0;
END;
$$;
