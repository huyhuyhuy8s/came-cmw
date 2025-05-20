
-- Function to check if an email is confirmed in the auth.users table
CREATE OR REPLACE FUNCTION public.check_email_confirmed(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_confirmed BOOLEAN;
BEGIN
  SELECT email_confirmed_at IS NOT NULL INTO is_confirmed 
  FROM auth.users 
  WHERE email = email_to_check
  LIMIT 1;
  
  RETURN is_confirmed;
END;
$$;
