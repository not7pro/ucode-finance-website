export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'founder' | 'employee' | 'client';
export type CurrencyCode = 'LKR' | 'SAR' | 'USD';
export type ProjectStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';
export type RequestPriority = 'normal' | 'high' | 'rush';
export type RequestStatus = 'submitted' | 'queued' | 'in_production' | 'review' | 'completed' | 'cancelled';
export type DeliverableStatus = 'draft' | 'internal_review' | 'client_review' | 'approved' | 'in_production';
export type InvoiceStatus = 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'bank_transfer' | 'card' | 'cash' | 'crypto';
export type SlipStatus = 'pending' | 'verified' | 'rejected';
export type PrintStatus = 'queued' | 'pre_press' | 'printing' | 'finishing' | 'delivered';
export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  job_title?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  legal_name?: string;
  slug: string;
  brand_color: string;
  logo_url?: string;
  billing_email?: string;
  billing_address?: string;
  currency: CurrencyCode;
  portal_subdomain?: string;
  is_active: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  code: string;
  description?: string;
  status: ProjectStatus;
  total_budget_cents: number;
  currency: CurrencyCode;
  launch_target_date?: string;
  lead_specialist_id?: string;
  free_revision_rounds_allotted: number;
  created_at: string;
}

export interface RequestTicket {
  id: string;
  client_id: string;
  project_id?: string;
  ticket_number: string;
  title: string;
  description: string;
  category: string;
  priority: RequestPriority;
  rush_fee_cents: number;
  status: RequestStatus;
  sla_due_at?: string;
  assigned_specialist_id?: string;
  submitted_by?: string;
  attachment_urls: string[];
  reference_url?: string;
  created_at: string;
}

export interface Deliverable {
  id: string;
  project_id: string;
  request_id?: string;
  title: string;
  category: string;
  status: DeliverableStatus;
  current_version_tag: string;
  client_approved_at?: string;
  client_approved_by?: string;
  founder_signed_off_at?: string;
  founder_signed_off_by?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  client_id: string;
  project_id?: string;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  currency: CurrencyCode;
  subtotal_cents: number;
  tax_cents: number;
  discount_cents: number;
  total_cents: number;
  paid_cents: number;
  balance_due_cents: number;
  notes?: string;
  terms?: string;
  created_at: string;
}

export interface InvoiceLineItem {
  id: string;
  invoice_id: string;
  item_order: number;
  description: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
  created_at: string;
}

export interface Timesheet {
  id: string;
  contractor_id: string;
  project_id: string;
  request_id?: string;
  task_description: string;
  start_time: string;
  end_time?: string;
  duration_seconds: number;
  hourly_rate_cents: number;
  total_amount_cents: number;
  auto_logged_via_timer: boolean;
  is_approved_by_founder: boolean;
  created_at: string;
}

export interface AgencyEquitySummary {
  total_received_cents: number;
  total_expenses_cents: number;
  net_operating_profit_cents: number;
  abdullah_share_cents: number;
  umar_share_cents: number;
  partner_a_draw_cents: number;
  partner_b_draw_cents: number;
}
