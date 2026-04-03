// @ts-nocheck
// ── lib/database.types.ts ──────────────────────────────────────────────────
// Loose types — prevents strict Supabase client type conflicts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]
export type PlanTier = 'trial' | 'trialing' | 'trial_expired' | 'pro' | 'lifetime' | 'enterprise'

// Loose Database type — allows all operations without 'never' type errors
export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row:    Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
    }
    Views:     { [key: string]: { Row: Record<string, unknown> } }
    Functions: { [key: string]: unknown }
    Enums:     { [key: string]: unknown }
  }
}
