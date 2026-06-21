ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS forma_pagamento text NOT NULL DEFAULT 'dinheiro',
  ADD COLUMN IF NOT EXISTS pago boolean NOT NULL DEFAULT false;

ALTER TABLE public.pedidos REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'pedidos'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.pedidos';
  END IF;
END $$;