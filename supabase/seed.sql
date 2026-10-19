-- ==============================================================================
-- UCODE AGENCY OS — COMPLETE PRODUCTION SEED SCRIPT (SUPABASE)
-- Fully consistent relational data for Ucode Agency Colombo & Gulf expansion.
-- Eliminates all 9 data inconsistencies documented in the audit.
-- ==============================================================================

-- 1. Agency Master Profile
INSERT INTO agency_settings (
    id, agency_name, primary_domain, colombo_address, contact_phone, contact_email, demo_mode,
    partner_a_name, partner_a_title, partner_a_split_pct,
    partner_b_name, partner_b_title, partner_b_split_pct,
    base_currency, fx_rate_sar, fx_rate_usd
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Ucode Media (Pvt) Ltd',
    'universalcode.site',
    '109 Quarry Road, Dehiwala, Colombo, Sri Lanka',
    '+94 76 059 5115',
    'hello@universalcode.site',
    true,
    'Abdullah Arshad', 'Founder & CEO', 50.00,
    'Ahamed Umar Hunais', 'Managing Partner & COO', 50.00,
    'LKR', 82.500000, 305.000000
) ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- 2. Client Companies
INSERT INTO clients (id, name, legal_name, slug, brand_color, billing_email, currency, is_active)
VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    'Sip & Play Cafe',
    'Sip and Play Hospitality (Pvt) Ltd',
    'sipandplay',
    '#34e0a1',
    'vivian@sipandplay.lk',
    'LKR',
    true
),
(
    'c0000000-0000-0000-0000-000000000002',
    'Oh Donuts',
    'Oh Donuts Artisan Bakery',
    'ohdonuts',
    '#f59e0b',
    'orders@ohdonuts.lk',
    'LKR',
    true
),
(
    'c0000000-0000-0000-0000-000000000003',
    'Nature''s Treasure',
    'Nature''s Treasure Organics (Pvt) Ltd',
    'naturestreasure',
    '#10b981',
    'accounts@naturestreasure.lk',
    'LKR',
    true
)
ON CONFLICT (id) DO NOTHING;

-- 3. Projects
INSERT INTO projects (
    id, client_id, name, code, description, status, total_budget_cents, currency, launch_target_date, free_revision_rounds_allotted
) VALUES
(
    'p0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Sip & Play Omnichannel Web & Social Retainer',
    'PRJ-SIP-2026',
    'Complete custom web application, online menu & table booking engine, plus 12 monthly reels & collateral.',
    'active',
    8830000, -- 88,300.00 LKR
    'LKR',
    '2026-10-30',
    2
)
ON CONFLICT (id) DO NOTHING;

-- 4. Project Phases
INSERT INTO phases (project_id, phase_number, name, description, is_completed, completed_at, target_date)
VALUES
('p0000000-0000-0000-0000-000000000001', 1, 'Brand Guidelines & Vector System', 'Typography, colors, and asset guidelines signed off by Vivian.', true, '2026-10-08T10:00:00Z', '2026-10-08'),
('p0000000-0000-0000-0000-000000000001', 2, 'UI Wireframes & Menu Architecture', 'Figma interactive prototype approved.', true, '2026-10-14T15:30:00Z', '2026-10-14'),
('p0000000-0000-0000-0000-000000000001', 3, 'Dynamic Web App & Table Reservation Engine', 'Developing responsive menu, IPG webhook integration, and board game catalog.', false, NULL, '2026-10-25'),
('p0000000-0000-0000-0000-000000000001', 4, 'Autumn Launch & Physical Collateral Dispatch', 'Table tents, outdoor vinyls, and live deployment on universalcode.site/sipandplay.', false, NULL, '2026-10-30');

-- 5. Authorized Agency Bank Account
INSERT INTO agency_bank_accounts (bank_name, branch_name, account_number, account_holder_name, swift_code, currency, is_active, is_client_visible)
VALUES (
    'Commercial Bank of Ceylon',
    'Dehiwala',
    '8029132085',
    'Ahamed Umar Hunais',
    'CCEYLKAX',
    'LKR',
    true,
    true
);

-- 6. Authoritative Normalized Invoices (Resolves Invoice Contradiction)
INSERT INTO invoices (
    id, client_id, project_id, invoice_number, status, issue_date, due_date, currency,
    subtotal_cents, tax_cents, discount_cents, total_cents, paid_cents, balance_due_cents, notes
) VALUES
(
    'i0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'p0000000-0000-0000-0000-000000000001',
    'INV-2026-0006',
    'paid',
    '2026-10-04',
    '2026-10-18',
    'LKR',
    7330000, 0, 0, 7330000, 7330000, 0,
    'Phase 1 & 2 Retainer Deposit paid via Commercial Bank transfer.'
),
(
    'i0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    'p0000000-0000-0000-0000-000000000001',
    'INV-2026-0007',
    'sent',
    '2026-10-18',
    '2026-10-30',
    'LKR',
    1500000, 0, 0, 1500000, 0, 1500000,
    'Milestone Completion Balance: Table Reservation Launch (Oct 30).'
)
ON CONFLICT (id) DO NOTHING;

-- Invoice Line Items (Clear line-item breakdown)
INSERT INTO invoice_line_items (invoice_id, item_order, description, quantity, unit_price_cents, total_cents)
VALUES
('i0000000-0000-0000-0000-000000000001', 1, 'Custom Web Application UI/UX Design & Front-end Retainer (Phase 1/2)', 1, 4830000, 4830000),
('i0000000-0000-0000-0000-000000000001', 2, 'October Social Media Retainer (12 Reels & Content Calendar)', 1, 2500000, 2500000),
('i0000000-0000-0000-0000-000000000002', 1, 'Final Milestone Balance: Table Booking & Live Deployment Sign-off', 1, 1500000, 1500000);

-- Verified Deposit Payment
INSERT INTO payments (
    invoice_id, amount_cents, currency, payment_method, payment_date, reference_number, receipt_number
) VALUES (
    'i0000000-0000-0000-0000-000000000001',
    7330000,
    'LKR',
    'bank_transfer',
    '2026-10-04',
    'COMBANK-REF-892104',
    'REC-2026-0001'
);

-- 7. Authoritative Addon Catalog (Standardizes WhatsApp Bot Pricing)
INSERT INTO addon_catalog (name, description, category, setup_fee_cents, monthly_retainer_cents, currency, estimated_turnaround_days)
VALUES
(
    'Productized WhatsApp & Instagram AI Lead Bot',
    '24/7 automated conversational bot answering menu questions, taking table reservations, and sending PDF menus.',
    'AI Automation',
    7500000, -- 75,000 LKR setup
    2500000, -- 25,000 LKR/mo retainer
    'LKR',
    5
),
(
    'Smart Tap NFC Google Review Standees',
    'Custom laser-cut acrylic standees with pre-programmed NFC chips to boost Google Maps cafe ratings by 4.2x.',
    'Print Collateral',
    1850000,
    0,
    'LKR',
    3
),
(
    'Speed & Security CDN Hardening',
    'Cloudflare Enterprise DNS, edge image optimization, SSL/TLS, and DDoS mitigation.',
    'Security',
    2500000,
    0,
    'LKR',
    2
);

-- 8. Print Vendors & Active Jobs
INSERT INTO print_vendors (id, name, location, contact_person, contact_phone)
VALUES ('v0000000-0000-0000-0000-000000000001', 'Dehiwala Print Express', 'Galle Road, Dehiwala', 'Kasun Perera', '+94 77 123 4567');

INSERT INTO print_jobs (
    project_id, vendor_id, item_title, quantity, stock_paper_spec, dimensions, status, target_delivery_date, cost_cogs_cents
) VALUES (
    'p0000000-0000-0000-0000-000000000001',
    'v0000000-0000-0000-0000-000000000001',
    'Autumn Menu Table Tents (A5 Double Sided)',
    500,
    '350gsm Silk Artboard with Matte Thermal Lamination & Crease Score',
    '148mm x 210mm (Folded)',
    'printing',
    '2026-10-24',
    3800000 -- 38,000 LKR COGS
);
