-- 1. Create a function to call the Edge Function
CREATE OR REPLACE FUNCTION public.handle_order_change()
RETURNS TRIGGER AS $$
DECLARE
  payload JSONB;
BEGIN
  -- Construct the payload with NEW data
  payload := jsonb_build_object(
    'record', row_to_json(NEW),
    'old_record', row_to_json(OLD),
    'type', TG_OP
  );

  -- Perform an HTTP request to the Edge Function (replace URL after deployment)
  -- Note: You will need to replace YOUR_PROJECT_REF and YOUR_ANON_KEY
  PERFORM
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/whatsapp-notify',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_ANON_KEY'
      ),
      body := payload
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger on the 'orders' table
DROP TRIGGER IF EXISTS on_order_change ON public.orders;
CREATE TRIGGER on_order_change
AFTER INSERT OR UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_order_change();

-- 3. Enable the 'pg_net' extension if not already enabled (required for http requests)
CREATE EXTENSION IF NOT EXISTS pg_net;
