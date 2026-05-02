
ALTER TABLE public.products ALTER COLUMN seller_id DROP NOT NULL;

-- Update insert policy to allow nullable seller for demo, real users still must own theirs
DROP POLICY IF EXISTS "Users insert own products" ON public.products;
CREATE POLICY "Users insert own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users update own products" ON public.products;
CREATE POLICY "Users update own products" ON public.products FOR UPDATE USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users delete own products" ON public.products;
CREATE POLICY "Users delete own products" ON public.products FOR DELETE USING (auth.uid() = seller_id);
