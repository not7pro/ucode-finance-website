-- ==============================================================================
-- UCODE AGENCY OS — COMPLETE PRODUCTION POSTGRESQL SCHEMA (SUPABASE)
-- Architecture: Next.js (App Router) + Supabase (Postgres, Auth, RLS, Storage)
-- Designed with Apple/Linear-level restraint. Zero hardcoded UI data.
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ENUMS & CORE TYPES
-- ==============================================================================

CREATE TYPE user_role AS ENUM ('founder', 'employee', 'client');
CREATE TYPE currency_code AS ENUM ('LKR', 'SAR', 'USD');
CREATE TYPE project_status AS ENUM ('draft', 'active', 'paused', 'completed', 'archived');
CREATE TYPE request_priority AS ENUM ('normal', 'high', 'rush');
CREATE TYPE request_status AS ENUM ('submitted', 'queued', 'in_production', 'review', 'completed', 'cancelled');
CREATE TYPE deliverable_status AS ENUM ('draft', 'internal_review', 'client_review', 'approved', 'in_production');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'partial', 'paid', 'overdue', 'cancelled');
CREATE TYPE payment_method AS ENUM ('bank_transfer', 'card', 'cash', 'crypto');
CREATE TYPE slip_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE print_status AS ENUM ('queued', 'pre_press', 'printing', 'finishing', 'delivered');
CREATE TYPE proposal_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'rejected');

-- ==============================================================================
-- 2. AGENCY SETTINGS & AUDIT LOG
-- ==============================================================================

CREATE TABLE agency_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_name TEXT NOT NULL DEFAULT 'Ucode Media (Pvt) Ltd',
    tagline TEXT DEFAULT 'Global Creative, Web & AI Studio',
    primary_domain TEXT DEFAULT 'universalcode.site',
    colombo_address TEXT DEFAULT '109 Quarry Road, Dehiwala, Colombo, Sri Lanka',
    contact_phone TEXT DEFAULT '+94 76 059 5115',
    contact_email TEXT DEFAULT 'hello@universalcode.site',
    demo_mode BOOLEAN NOT NULL DEFAULT false,
    partner_a_name TEXT NOT NULL DEFAULT 'Abdullah Arshad',
    partner_a_title TEXT NOT NULL DEFAULT 'Founder & CEO',
    partner_a_split_pct NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    partner_b_name TEXT NOT NULL DEFAULT 'Ahamed Umar Hunais',
    partner_b_title TEXT NOT NULL DEFAULT 'Managing Partner & COO',
    partner_b_split_pct NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    base_currency currency_code NOT NULL DEFAULT 'LKR',
    fx_rate_sar NUMERIC(12,6) NOT NULL DEFAULT 82.500000,
    fx_rate_usd NUMERIC(12,6) NOT NULL DEFAULT 305.000000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_email TEXT,
    user_role user_role,
    action TEXT NOT NULL,
    entity_table TEXT NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_entity ON audit_log (entity_table, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log (created_at DESC);

-- ==============================================================================
-- 3. PROFILES & MULTI-TENANT CLIENT WORKSPACES
-- ==============================================================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'client',
    phone TEXT,
    avatar_url TEXT,
    job_title TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    legal_name TEXT,
    slug TEXT NOT NULL UNIQUE,
    brand_color TEXT DEFAULT '#34e0a1',
    logo_url TEXT,
    billing_email TEXT,
    billing_address TEXT,
    currency currency_code NOT NULL DEFAULT 'LKR',
    portal_subdomain TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Maps users to clients (multi-user per client support)
CREATE TABLE client_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    can_sign_off BOOLEAN NOT NULL DEFAULT true,
    can_view_billing BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (client_id, profile_id)
);

-- ==============================================================================
-- 4. PROJECTS, PHASES & SCOPE OF WORK
-- ==============================================================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE, -- e.g. 'PRJ-SIP-2026'
    description TEXT,
    status project_status NOT NULL DEFAULT 'active',
    total_budget_cents BIGINT NOT NULL DEFAULT 0,
    currency currency_code NOT NULL DEFAULT 'LKR',
    launch_target_date DATE,
    lead_specialist_id UUID REFERENCES profiles(id),
    free_revision_rounds_allotted INT NOT NULL DEFAULT 2,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    phase_number INT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    target_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. TICKETING, REQUESTS & SLAS
-- ==============================================================================

CREATE SEQUENCE request_seq START 101;

CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    ticket_number TEXT NOT NULL UNIQUE, -- 'REQ-2026-0101'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Web Development', 'Print & Packaging', 'Video & Motion', 'Social Media'
    priority request_priority NOT NULL DEFAULT 'normal',
    rush_fee_cents BIGINT NOT NULL DEFAULT 0,
    status request_status NOT NULL DEFAULT 'submitted',
    sla_due_at TIMESTAMPTZ,
    assigned_specialist_id UUID REFERENCES profiles(id),
    submitted_by UUID REFERENCES profiles(id),
    attachment_urls TEXT[] DEFAULT '{}',
    reference_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 6. DELIVERABLES, ASSET VERSIONS & INTERACTIVE PROOFING
-- ==============================================================================

CREATE TABLE deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    request_id UUID REFERENCES requests(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    status deliverable_status NOT NULL DEFAULT 'draft',
    current_version_tag TEXT NOT NULL DEFAULT 'v1.0',
    client_approved_at TIMESTAMPTZ,
    client_approved_by UUID REFERENCES profiles(id),
    founder_signed_off_at TIMESTAMPTZ,
    founder_signed_off_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE deliverable_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deliverable_id UUID NOT NULL REFERENCES deliverables(id) ON DELETE CASCADE,
    version_tag TEXT NOT NULL, -- 'v1.0', 'v1.1', 'v2.0'
    file_storage_path TEXT, -- Supabase Storage signed object
    file_mime_type TEXT,
    file_size_bytes BIGINT,
    preview_url TEXT,
    external_link TEXT, -- e.g. Staging website or Figma file
    changelog TEXT,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE proof_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID NOT NULL REFERENCES deliverable_versions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id),
    pin_number INT NOT NULL,
    coord_x_percent NUMERIC(5,2) NOT NULL,
    coord_y_percent NUMERIC(5,2) NOT NULL,
    timestamp_seconds NUMERIC(8,2), -- for video proofs
    comment_text TEXT NOT NULL,
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    resolved_by UUID REFERENCES profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE revision_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deliverable_id UUID NOT NULL REFERENCES deliverables(id) ON DELETE CASCADE,
    round_number INT NOT NULL,
    is_billable BOOLEAN NOT NULL DEFAULT false,
    overage_charge_cents BIGINT NOT NULL DEFAULT 0,
    client_feedback_summary TEXT,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. FINANCIAL LEDGER: INVOICES, LINE ITEMS & BANK TRANSFERS
-- ==============================================================================

CREATE SEQUENCE invoice_seq START 1;

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL UNIQUE, -- 'INV-2026-0001'
    status invoice_status NOT NULL DEFAULT 'draft',
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '14 days'),
    currency currency_code NOT NULL DEFAULT 'LKR',
    subtotal_cents BIGINT NOT NULL DEFAULT 0,
    tax_cents BIGINT NOT NULL DEFAULT 0,
    discount_cents BIGINT NOT NULL DEFAULT 0,
    total_cents BIGINT NOT NULL DEFAULT 0,
    paid_cents BIGINT NOT NULL DEFAULT 0,
    balance_due_cents BIGINT NOT NULL DEFAULT 0,
    notes TEXT,
    terms TEXT DEFAULT 'Payment due within 14 days. Bank transfer to Commercial Bank Dehiwala.',
    pdf_storage_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE invoice_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    item_order INT NOT NULL DEFAULT 1,
    description TEXT NOT NULL,
    quantity NUMERIC(8,2) NOT NULL DEFAULT 1.00,
    unit_price_cents BIGINT NOT NULL,
    total_cents BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount_cents BIGINT NOT NULL,
    currency currency_code NOT NULL DEFAULT 'LKR',
    payment_method payment_method NOT NULL DEFAULT 'bank_transfer',
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reference_number TEXT,
    receipt_number TEXT UNIQUE,
    recorded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payment_slips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    file_storage_path TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status slip_status NOT NULL DEFAULT 'pending',
    verified_by UUID REFERENCES profiles(id),
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT
);

-- ==============================================================================
-- 8. AGENCY EXPENSES, PARTNER ACCOUNTS & 50/50 EQUITY
-- ==============================================================================

CREATE TABLE agency_bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_name TEXT NOT NULL DEFAULT 'Commercial Bank of Ceylon',
    branch_name TEXT NOT NULL DEFAULT 'Dehiwala',
    account_number TEXT NOT NULL,
    account_holder_name TEXT NOT NULL,
    swift_code TEXT DEFAULT 'CCEYLKAX',
    currency currency_code NOT NULL DEFAULT 'LKR',
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_client_visible BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE agency_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL, -- 'SaaS Tools', 'Contractors', 'Office & Hardware', 'Print Production', 'Marketing'
    description TEXT NOT NULL,
    amount_cents BIGINT NOT NULL,
    currency currency_code NOT NULL DEFAULT 'LKR',
    paid_by_partner TEXT NOT NULL, -- 'Abdullah', 'Umar'
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    receipt_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE partner_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_partner TEXT NOT NULL,
    to_partner TEXT NOT NULL,
    amount_cents BIGINT NOT NULL,
    currency currency_code NOT NULL DEFAULT 'LKR',
    transfer_date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 9. CONTRACTORS, TIME TRACKING & AUTOMATED SPRINT LOGS
-- ==============================================================================

CREATE TABLE contractor_profiles (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    specialty TEXT NOT NULL, -- 'Senior Web Dev', 'Lead UI/UX', 'Motion Editor', 'Performance Marketer'
    default_hourly_rate_cents BIGINT NOT NULL,
    currency currency_code NOT NULL DEFAULT 'LKR',
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE timesheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contractor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    request_id UUID REFERENCES requests(id) ON DELETE SET NULL,
    task_description TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_seconds INT NOT NULL DEFAULT 0,
    hourly_rate_cents BIGINT NOT NULL,
    total_amount_cents BIGINT NOT NULL DEFAULT 0,
    auto_logged_via_timer BOOLEAN NOT NULL DEFAULT true,
    is_approved_by_founder BOOLEAN NOT NULL DEFAULT false,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE contractor_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contractor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_seconds INT NOT NULL DEFAULT 0,
    gross_amount_cents BIGINT NOT NULL DEFAULT 0,
    currency currency_code NOT NULL DEFAULT 'LKR',
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'approved', 'paid'
    paid_at TIMESTAMPTZ,
    paid_from_partner TEXT,
    reference_tx TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 10. PHYSICAL PRINTING & VENDOR TRACKER
-- ==============================================================================

CREATE TABLE print_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT DEFAULT 'Colombo, Sri Lanka',
    contact_person TEXT,
    contact_phone TEXT,
    specialties TEXT[] DEFAULT '{"A2 Posters", "Acrylic Standees", "Menu Tents", "Packaging"}'
);

CREATE TABLE print_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    deliverable_id UUID REFERENCES deliverables(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES print_vendors(id) ON DELETE SET NULL,
    item_title TEXT NOT NULL,
    quantity INT NOT NULL,
    stock_paper_spec TEXT, -- '350gsm Silk with Matte Lam'
    dimensions TEXT, -- 'A5 Table Tent', 'A2 Double Sided'
    status print_status NOT NULL DEFAULT 'queued',
    target_delivery_date DATE,
    actual_delivery_date DATE,
    cost_cogs_cents BIGINT NOT NULL DEFAULT 0,
    proof_photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 11. STRATEGIC GROWTH LAB: MONTE CARLO, ADDONS & PROPOSALS
-- ==============================================================================

CREATE TABLE addon_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- 'AI Automation', 'Growth & SEO', 'Print Collateral', 'Security'
    setup_fee_cents BIGINT NOT NULL DEFAULT 0,
    monthly_retainer_cents BIGINT NOT NULL DEFAULT 0,
    currency currency_code NOT NULL DEFAULT 'LKR',
    estimated_turnaround_days INT DEFAULT 5,
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE addon_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    addon_id UUID NOT NULL REFERENCES addon_catalog(id) ON DELETE CASCADE,
    custom_brief TEXT,
    total_cents BIGINT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    ordered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    prospect_name TEXT NOT NULL,
    prospect_email TEXT NOT NULL,
    title TEXT NOT NULL,
    scope_of_work JSONB NOT NULL DEFAULT '[]',
    total_contract_cents BIGINT NOT NULL,
    monthly_retainer_cents BIGINT NOT NULL DEFAULT 0,
    currency currency_code NOT NULL DEFAULT 'LKR',
    status proposal_status NOT NULL DEFAULT 'draft',
    valid_until DATE,
    signed_at TIMESTAMPTZ,
    signer_name TEXT,
    signer_ip INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 12. STORED FUNCTIONS & AUTOMATIC NUMBER GENERATORS
-- ==============================================================================

-- Generates atomic sequential invoice numbers: INV-2026-0001
CREATE OR REPLACE FUNCTION generate_next_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
    cur_year TEXT;
    seq_num INT;
BEGIN
    cur_year := TO_CHAR(CURRENT_DATE, 'YYYY');
    seq_num := nextval('invoice_seq');
    NEW.invoice_number := 'INV-' || cur_year || '-' || LPAD(seq_num::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_invoice_number
BEFORE INSERT ON invoices
FOR EACH ROW
WHEN (NEW.invoice_number IS NULL OR NEW.invoice_number = '')
EXECUTE FUNCTION generate_next_invoice_number();

-- Generates atomic sequential ticket numbers: REQ-2026-0101
CREATE OR REPLACE FUNCTION generate_next_request_number()
RETURNS TRIGGER AS $$
DECLARE
    cur_year TEXT;
    seq_num INT;
BEGIN
    cur_year := TO_CHAR(CURRENT_DATE, 'YYYY');
    seq_num := nextval('request_seq');
    NEW.ticket_number := 'REQ-' || cur_year || '-' || LPAD(seq_num::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_request_number
BEFORE INSERT ON requests
FOR EACH ROW
WHEN (NEW.ticket_number IS NULL OR NEW.ticket_number = '')
EXECUTE FUNCTION generate_next_request_number();

-- Dynamic 50/50 Partner Equity Split View Function
CREATE OR REPLACE FUNCTION get_agency_equity_summary()
RETURNS TABLE (
    total_received_cents BIGINT,
    total_expenses_cents BIGINT,
    net_operating_profit_cents BIGINT,
    abdullah_share_cents BIGINT,
    umar_share_cents BIGINT,
    partner_a_draw_cents BIGINT,
    partner_b_draw_cents BIGINT
) AS $$
DECLARE
    rec_sum BIGINT;
    exp_sum BIGINT;
    net_profit BIGINT;
    p_a_exp BIGINT;
    p_b_exp BIGINT;
BEGIN
    SELECT COALESCE(SUM(amount_cents), 0) INTO rec_sum FROM payments;
    SELECT COALESCE(SUM(amount_cents), 0) INTO exp_sum FROM agency_expenses;
    SELECT COALESCE(SUM(amount_cents), 0) INTO p_a_exp FROM agency_expenses WHERE paid_by_partner = 'Abdullah';
    SELECT COALESCE(SUM(amount_cents), 0) INTO p_b_exp FROM agency_expenses WHERE paid_by_partner = 'Umar';

    net_profit := rec_sum - exp_sum;

    RETURN QUERY SELECT
        rec_sum,
        exp_sum,
        net_profit,
        (net_profit / 2)::BIGINT AS abdullah_share_cents,
        (net_profit / 2)::BIGINT AS umar_share_cents,
        p_a_exp AS partner_a_draw_cents,
        p_b_exp AS partner_b_draw_cents;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE agency_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverable_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE print_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE addon_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE addon_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Helper function: Get authenticated user's role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function: Check if authenticated user belongs to client
CREATE OR REPLACE FUNCTION is_client_member(target_client_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM client_memberships
        WHERE client_id = target_client_id AND profile_id = auth.uid()
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- --- FOUNDER POLICIES (Access to All) ---
CREATE POLICY "Founder full access on agency_settings" ON agency_settings FOR ALL USING (get_current_user_role() = 'founder');
CREATE POLICY "Founder full access on audit_log" ON audit_log FOR ALL USING (get_current_user_role() = 'founder');
CREATE POLICY "Founder full access on profiles" ON profiles FOR ALL USING (get_current_user_role() = 'founder');
CREATE POLICY "Founder full access on clients" ON clients FOR ALL USING (get_current_user_role() = 'founder');
CREATE POLICY "Founder full access on projects" ON projects FOR ALL USING (get_current_user_role() = 'founder');
CREATE POLICY "Founder full access on requests" ON requests FOR ALL USING (get_current_user_role() = 'founder');
CREATE POLICY "Founder full access on deliverables" ON deliverables FOR ALL USING (get_current_user_role() = 'founder');
CREATE POLICY "Founder full access on invoices" ON invoices FOR ALL USING (get_current_user_role() = 'founder');
CREATE POLICY "Founder full access on payments" ON payments FOR ALL USING (get_current_user_role() = 'founder');
CREATE POLICY "Founder full access on agency_expenses" ON agency_expenses FOR ALL USING (get_current_user_role() = 'founder');
CREATE POLICY "Founder full access on partner_transfers" ON partner_transfers FOR ALL USING (get_current_user_role() = 'founder');
CREATE POLICY "Founder full access on contractor_payouts" ON contractor_payouts FOR ALL USING (get_current_user_role() = 'founder');

-- --- EMPLOYEE POLICIES (Strict Role Boundary) ---
CREATE POLICY "Employee can view own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Employee can view assigned projects" ON projects FOR SELECT USING (
    get_current_user_role() = 'employee' AND (
        lead_specialist_id = auth.uid() OR
        EXISTS (SELECT 1 FROM requests WHERE requests.project_id = projects.id AND requests.assigned_specialist_id = auth.uid())
    )
);
CREATE POLICY "Employee can view and update assigned requests" ON requests FOR ALL USING (
    get_current_user_role() = 'employee' AND assigned_specialist_id = auth.uid()
);
CREATE POLICY "Employee can manage assigned deliverables" ON deliverables FOR ALL USING (
    get_current_user_role() = 'employee' AND EXISTS (
        SELECT 1 FROM requests WHERE requests.id = deliverables.request_id AND requests.assigned_specialist_id = auth.uid()
    )
);
CREATE POLICY "Employee can view and log own timesheets" ON timesheets FOR ALL USING (
    contractor_id = auth.uid()
);
-- Employee CANNOT view agency expenses, partner transfers, colleague payouts, or master bank balances.

-- --- CLIENT POLICIES (Tenant Isolation) ---
CREATE POLICY "Client can view own company" ON clients FOR SELECT USING (
    is_client_member(id)
);
CREATE POLICY "Client can view own projects" ON projects FOR SELECT USING (
    is_client_member(client_id)
);
CREATE POLICY "Client can view and submit own requests" ON requests FOR ALL USING (
    is_client_member(client_id)
);
CREATE POLICY "Client can view approved and review deliverables" ON deliverables FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = deliverables.project_id AND is_client_member(projects.client_id))
    AND status IN ('client_review', 'approved', 'in_production')
);
CREATE POLICY "Client can view and add proof comments" ON proof_comments FOR ALL USING (
    EXISTS (
        SELECT 1 FROM deliverable_versions v
        JOIN deliverables d ON d.id = v.deliverable_id
        JOIN projects p ON p.id = d.project_id
        WHERE v.id = proof_comments.version_id AND is_client_member(p.client_id)
    )
);
CREATE POLICY "Client can view own invoices" ON invoices FOR SELECT USING (
    is_client_member(client_id) AND status != 'draft'
);
CREATE POLICY "Client can view own line items" ON invoice_line_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_line_items.invoice_id AND is_client_member(invoices.client_id))
);
CREATE POLICY "Client can upload payment slips" ON payment_slips FOR INSERT WITH CHECK (
    is_client_member(client_id)
);
CREATE POLICY "Client can view own payment slips" ON payment_slips FOR SELECT USING (
    is_client_member(client_id)
);
CREATE POLICY "Client can view active bank account" ON agency_bank_accounts FOR SELECT USING (
    is_active = true AND is_client_visible = true
);
