ALTER TABLE public.pedidos ADD COLUMN tipo_entrega text NOT NULL DEFAULT 'retirada';
ALTER TABLE public.pedidos ADD COLUMN taxa_entrega numeric NOT NULL DEFAULT 0;