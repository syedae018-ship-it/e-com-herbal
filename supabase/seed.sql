-- ==============================================================================
-- MUSTAFA LIFE - SUPABASE SEED DATA (PHASE 2)
-- 5 Categories & 10+ Authentic Organic Herbal Wellness Products
-- ==============================================================================

-- 1. INSERT CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url, is_active) VALUES
('c1111111-1111-1111-1111-111111111111', 'Herbal Wellness', 'herbal-wellness', 'Time-tested Ayurvedic herbs and potent extracts for holistic vitality and daily balance.', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', true),
('c2222222-2222-2222-2222-222222222222', 'Natural Skincare', 'natural-skincare', 'Clean, toxin-free botanical skincare crafted to nourish and rejuvenate your natural glow.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', true),
('c3333333-3333-3333-3333-333333333333', 'Hair Care', 'hair-care', 'Pure herbal oils and cleansers infused with ancient herbs for root-to-tip nourishment.', 'https://images.unsplash.com/photo-1608248597359-59754f9a0c7c?auto=format&fit=crop&w=800&q=80', true),
('c4444444-4444-4444-4444-444444444444', 'Healthy Nutrition', 'healthy-nutrition', '100% plant-based organic superfoods, cold-pressed oils, and farm-fresh nutrition.', 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80', true),
('c5555555-5555-5555-5555-555555555555', 'Daily Essentials', 'daily-essentials', 'Gentle, chemical-conscious daily wellness solutions for you and your whole family.', 'https://images.unsplash.com/photo-1512290900672-1f41bf527ba7?auto=format&fit=crop&w=800&q=80', true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    is_active = EXCLUDED.is_active;

-- 2. INSERT 10+ REALISTIC ORGANIC PRODUCTS
INSERT INTO public.products (
    id, name, slug, short_description, description, category_id,
    price, original_price, stock, featured, is_active,
    benefits, ingredients, how_to_use
) VALUES
(
    '1111111-1111-1111-1111-111111111111',
    'Organic Moringa Superfood Powder',
    'organic-moringa-powder',
    'Nutrient-dense superfood powder packed with vitamins, antioxidants, and plant protein for natural daily energy.',
    'Sourced from certified organic farms, our pure Moringa Oleifera Leaf Powder is shade-dried to lock in maximum bioactive phytonutrients. Often celebrated as the "Miracle Tree", Moringa contains over 90 nutrients and 46 antioxidants to combat oxidative stress, revitalize stamina, and support natural metabolic balance.',
    'c4444444-4444-4444-4444-444444444444',
    449.00,
    599.00,
    85,
    true,
    true,
    'Boosts daily energy levels naturally; Supports immune defense and cellular detox; Enhances digestion and gut microbiome balance; 100% Raw, Vegan, and Non-GMO',
    '100% Certified Pure Organic Moringa Leaf (Moringa oleifera) Powder. No preservatives, colors, or binders.',
    'Mix 1 teaspoon (approx. 5g) into warm water, morning smoothies, fresh green juices, or sprinkle over salads. Best consumed in the morning.'
),
(
    'p2222222-2222-2222-2222-222222222222',
    'Herbal Immunity Boost Tablets',
    'herbal-immunity-tablets',
    'Potent Ayurvedic blend of Giloy, Tulsi, Amla, and Curcumin for powerful all-weather immune resilience.',
    'Our Herbal Immunity Tablets combine centuries-old Rasayana herbs crafted into convenient daily tablets. Formulated with high-potency standardized extracts of Giloy, Holy Basil (Tulsi), Vitamin C-rich Amla, and 95% Curcuminoids to build deep, sustainable cellular immunity and defend against seasonal pollutants.',
    'c1111111-1111-1111-1111-111111111111',
    499.00,
    699.00,
    120,
    true,
    true,
    'Strengthens immune cell response; Helps relieve respiratory discomfort and seasonal allergies; Promotes healthy inflammatory balance; Rich in natural bio-available Vitamin C',
    'Organic Giloy (Tinospora cordifolia) Extract, Holy Basil (Ocimum sanctum) Extract, Amla (Phyllanthus emblica) Fruit Extract, Curcumin Extract (95%), Piperine (Black Pepper Extract).',
    'Take 1 tablet twice daily with lukewarm water after meals, or as directed by your Ayurvedic healthcare practitioner.'
),
(
    'p3333333-3333-3333-3333-333333333333',
    'Pure Aloe Vera Gentle Face Cleanser',
    'aloe-vera-face-cleanser',
    'Sulfate-free soothing facial cleanser with cold-pressed organic aloe vera and calming chamomile extract.',
    'Wash away dirt, pollutants, and excess oil without stripping your skin’s vital lipid barrier. Formulated with 80% fresh organic Aloe Vera inner leaf gel, soothing German Chamomile, and botanical surfactants for soft, refreshed, and balanced skin.',
    'c2222222-2222-2222-2222-222222222222',
    349.00,
    449.00,
    64,
    true,
    true,
    'Gently purifies pores without moisture loss; Calms redness, irritation, and sensitivity; Restores skin pH balance (5.5); Free from SLS, SLES, parabens, and synthetic fragrance',
    'Organic Aloe Barbadensis Leaf Juice, Coco-Glucoside, Vegetable Glycerin, Chamomilla Recutita (Chamomile) Flower Extract, Green Tea Leaf Extract, Provitamin B5 (Panthenol).',
    'Apply a coin-sized pump to damp face. Gently massage in upward circular motions for 60 seconds. Rinse thoroughly with cool or lukewarm water. Pat dry with a clean towel.'
),
(
    'p4444444-4444-4444-4444-444444444444',
    'Cold Pressed Virgin Coconut Oil',
    'cold-pressed-coconut-oil',
    '100% raw, unrefined cold-pressed coconut oil for nourishing deep hair conditioning and body hydration.',
    'Extracted from fresh, mature organic coconuts using traditional wooden expeller (Kachi Ghani) cold-pressing techniques. This retains the rich medium-chain triglycerides (MCTs) including Lauric acid, delivering a heavenly natural aroma and luxurious conditioning for hair, scalp, and skin.',
    'c4444444-4444-4444-4444-444444444444',
    399.00,
    499.00,
    90,
    true,
    true,
    'Deeply penetrates hair shafts to reduce protein loss; Nourishes dry scalp and helps prevent dandruff; Ultra-hydrating natural body moisturizer; Edible grade and 100% chemical free',
    '100% Pure Cold Pressed Virgin Coconut (Cocos nucifera) Oil. Zero additives, zero heat processing.',
    'Warm a small amount between your palms. For Hair: Gently massage into scalp and ends 1-2 hours before washing. For Skin: Apply right after showering to seal in moisture.'
),
(
    'p5555555-5555-5555-5555-555555555555',
    'Herbal Hair Growth & Vitality Oil',
    'herbal-hair-growth-oil',
    'Traditional Kshirpak formulation with Bhringraj, Rosemary, Brahmi, and Amla for stronger, denser hair roots.',
    'Infused through an authentic 21-day slow decoction process, this restorative Ayurvedic hair oil brings together Bhringraj (the king of hair), stimulating Rosemary oil, Brahmi, and cold-pressed Sesame oil to revitalize dormant follicles, reduce shedding, and promote thick, lustrous growth.',
    'c3333333-3333-3333-3333-333333333333',
    599.00,
    799.00,
    45,
    true,
    true,
    'Stimulates micro-circulation at the hair roots; Significantly minimizes hair breakage and split ends; Delays premature greying naturally; Leaves hair silky and manageable',
    'Bhringraj (Eclipta alba), Brahmi (Bacopa monnieri), Amla (Emblica officinalis), Rosemary Essential Oil, Methi (Fenugreek) Seed Extract, Cold Pressed Sesame Oil, Castor Oil.',
    'Apply generously to scalp using the root applicator. Massage gently with fingertips in circular motions for 5 to 10 minutes. Leave on overnight or for minimum 2 hours before shampooing.'
),
(
    'p6666666-6666-6666-6666-666666666666',
    'Organic Turmeric Curcumin 95% Capsules',
    'organic-turmeric-capsules',
    'High-potency organic turmeric with 95% standardized curcumin and black pepper extract for joint and cellular vitality.',
    'Harvested from certified organic farms in the foothills of India, our Turmeric capsules combine full-spectrum turmeric rhizome with 95% standardized Curcumin extract. Enriched with BioPerine (Black Pepper Extract) to enhance curcumin absorption by up to 2000%.',
    'c1111111-1111-1111-1111-111111111111',
    549.00,
    749.00,
    70,
    true,
    true,
    'Supports joint mobility and flexibility; Powerful antioxidant support against free radicals; Promotes glowing skin and healthy cardiovascular function; Enhanced absorption formula',
    'Organic Curcuma Longa (Turmeric) Root Powder (500mg), Standardized Curcuminoids 95% (200mg), BioPerine Black Pepper Extract (5mg), Plant Cellulose Capsule.',
    'Take 1 capsule twice daily with meals or a healthy fat source (such as milk or coconut oil) for optimal bioavailability.'
),
(
    'p7777777-7777-7777-7777-777777777777',
    'KSM-66 Organic Ashwagandha Root',
    'ksm-66-ashwagandha-capsules',
    'Full-spectrum root extract designed to balance cortisol, ease daily stress, and improve restful sleep quality.',
    'KSM-66 is the highest concentration full-spectrum root extract available today. Our formula helps modulate stress response, support cognitive clarity, and foster deep restorative rest without daytime drowsiness.',
    'c1111111-1111-1111-1111-111111111111',
    649.00,
    899.00,
    55,
    false,
    true,
    'Helps regulate cortisol and stress hormones; Promotes deep, uninterrupted sleep; Boosts cognitive endurance and vitality; Clinically researched adaptogen',
    'KSM-66 Organic Ashwagandha (Withania somnifera) Root Extract (600mg, standardized to 5% withanolides), Vegetarian Capsule.',
    'Take 1 capsule in the evening with warm milk or water 30 minutes before bedtime.'
),
(
    'p8888888-8888-8888-8888-888888888888',
    'Pure Hydro-Distilled Rose Water Toner',
    'pure-rose-water-toner',
    'Steam-distilled pure Rosa Damascena mist to hydrate, tone, and balance skin pH with zero alcohol.',
    'Crafted from early morning hand-picked Kannauj Damask roses, this alcohol-free mist delivers instant botanical hydration, shrinks open pores, and revitalizes tired skin throughout the day.',
    'c2222222-2222-2222-2222-222222222222',
    299.00,
    399.00,
    110,
    false,
    true,
    'Instantly hydrates and tightens enlarged pores; Balances skin natural pH; Alcohol-free, preservative-free, 100% natural; Multi-use as makeup setting spray or face refresher',
    '100% Pure Steam Distilled Damask Rose (Rosa damascena) Floral Hydrosol.',
    'Spray evenly across face and neck after cleansing or whenever your skin feels dry or fatigued. Allow to air dry.'
),
(
    'p9999999-9999-9999-9999-999999999999',
    'Organic Wild Forest Raw Honey',
    'wild-forest-raw-honey',
    'Unprocessed, unheated, single-origin raw honey harvested sustainably from deep Himalayan forests.',
    'Unlike commercially processed syrups, our Raw Forest Honey is cold-extracted without boiling or ultra-filtering, preserving all naturally occurring enzymes, pollen, propolis, and essential minerals.',
    'c4444444-4444-4444-4444-444444444444',
    429.00,
    549.00,
    60,
    false,
    true,
    'Rich in live enzymes and bio-active pollen; Natural immune tonic and throat soothing elixir; Zero added sugar, zero corn syrup, zero adulteration; Delicious rich floral taste',
    '100% Pure Wild Forest Raw Honey.',
    'Enjoy 1 tablespoon straight, or stir into warm herbal tea, lemon water, breakfast oats, or desserts. Do not boil.'
),
(
    'paaaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Organic Wild Amla & Bhringraj Shampoo Bar',
    'amla-bhringraj-shampoo-bar',
    'Zero-plastic solid hair cleanser enriched with Shikakai, Reetha, and nourishing botanical oils.',
    'Switch to clean hair care with our concentrated herbal shampoo bar. Lathers luxuriously into a rich foam that gently lifts away grease while infusing hair with nourishing Amla tannins and strengthening Bhringraj.',
    'c3333333-3333-3333-3333-333333333333',
    279.00,
    349.00,
    80,
    false,
    true,
    'Equates to 3 liquid shampoo bottles (Zero plastic waste); Gently balances scalp microbiome without harsh sulfates; Conditions hair strands naturally with Shikakai; Compact and travel friendly',
    'Sodium Cocoyl Isethionate, Organic Amla Fruit Powder, Bhringraj Leaf Extract, Shikakai Powder, Reetha Fruit Extract, Shea Butter, Sweet Almond Oil.',
    'Rub wet bar between hands or directly onto wet scalp until rich lather forms. Massage gently into scalp and hair. Rinse clean.'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    short_description = EXCLUDED.short_description,
    description = EXCLUDED.description,
    category_id = EXCLUDED.category_id,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    stock = EXCLUDED.stock,
    featured = EXCLUDED.featured,
    is_active = EXCLUDED.is_active,
    benefits = EXCLUDED.benefits,
    ingredients = EXCLUDED.ingredients,
    how_to_use = EXCLUDED.how_to_use;

-- 3. INSERT PRODUCT IMAGES
INSERT INTO public.product_images (product_id, image_url, sort_order) VALUES
('1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', 1),
('1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80', 2),
('2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', 1),
('2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80', 2),
('3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', 1),
('3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', 2),
('4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80', 1),
('4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', 2),
('5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1608248597359-59754f9a0c7c?auto=format&fit=crop&w=800&q=80', 1),
('5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80', 2),
('6666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80', 1),
('6666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80', 2),
('7777777-7777-7777-7777-777777777777', 'https://images.unsplash.com/photo-1512290900672-1f41bf527ba7?auto=format&fit=crop&w=800&q=80', 1),
('8888888-8888-8888-8888-888888888888', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', 1),
('9999999-9999-9999-9999-999999999999', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80', 1),
('aaaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1607006314144-8622ff6fa2c0?auto=format&fit=crop&w=800&q=80', 1);

-- 4. INSERT SAMPLE REVIEWS
INSERT INTO public.reviews (product_id, customer_name, rating, comment, verified_purchase) VALUES
('1111111-1111-1111-1111-111111111111', 'Priya Sharma', 5, 'The quality is unmatched! I mix a spoon into my morning smoothie every day and notice a clear boost in my energy.', true),
('2222222-2222-2222-2222-222222222222', 'Rohan Mehta', 5, 'Essential for changing weather. Since taking these Giloy & Amla tablets, my seasonal allergies are virtually gone.', true),
('3333333-3333-3333-3333-333333333333', 'Ananya Iyer', 5, 'So soothing on sensitive skin! Doesn''t dry my face at all. Truly authentic aloe feel with a subtle natural scent.', true),
('5555555-5555-5555-5555-555555555555', 'Devika Nair', 5, 'My hair fall decreased noticeably in just 3 weeks of using this Bhringraj oil. Scalp feels refreshed and cool.', true),
('6666666-6666-6666-6666-666666666666', 'Amitabh Verma', 5, 'High grade turmeric with black pepper extract. Excellent for post-workout joint stiffness.', true);
