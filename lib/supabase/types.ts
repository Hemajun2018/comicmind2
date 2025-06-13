export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          daily_free_count: number
          last_free_reset: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          daily_free_count?: number
          last_free_reset?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          daily_free_count?: number
          last_free_reset?: string
          created_at?: string
          updated_at?: string
        }
      }
      mindmaps: {
        Row: {
          id: string
          user_id: string | null
          title: string
          original_text: string
          generated_structure: string
          final_structure: string
          image_url: string | null
          style: 'kawaii' | 'flat' | 'watercolor' | 'chalkboard' | '3d'
          aspect_ratio: '1:1' | '3:4' | '9:16' | '4:3' | '16:9'
          language: 'english' | 'chinese' | 'japanese' | 'spanish' | 'french' | 'german' | 'korean' | 'portuguese'
          is_public: boolean
          generation_time_ms: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          original_text: string
          generated_structure: string
          final_structure: string
          image_url?: string | null
          style: 'kawaii' | 'flat' | 'watercolor' | 'chalkboard' | '3d'
          aspect_ratio: '1:1' | '3:4' | '9:16' | '4:3' | '16:9'
          language: 'english' | 'chinese' | 'japanese' | 'spanish' | 'french' | 'german' | 'korean' | 'portuguese'
          is_public?: boolean
          generation_time_ms?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          original_text?: string
          generated_structure?: string
          final_structure?: string
          image_url?: string | null
          style?: 'kawaii' | 'flat' | 'watercolor' | 'chalkboard' | '3d'
          aspect_ratio?: '1:1' | '3:4' | '9:16' | '4:3' | '16:9'
          language?: 'english' | 'chinese' | 'japanese' | 'spanish' | 'french' | 'german' | 'korean' | 'portuguese'
          is_public?: boolean
          generation_time_ms?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_type: 'free' | 'pro'
          status: 'active' | 'inactive' | 'cancelled' | 'past_due'
          current_period_start: string
          current_period_end: string
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_type: 'free' | 'pro'
          status?: 'active' | 'inactive' | 'cancelled' | 'past_due'
          current_period_start: string
          current_period_end: string
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_type?: 'free' | 'pro'
          status?: 'active' | 'inactive' | 'cancelled' | 'past_due'
          current_period_start?: string
          current_period_end?: string
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      usage_stats: {
        Row: {
          id: string
          user_id: string | null
          date: string
          mindmaps_created: number
          is_anonymous: boolean
          ip_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          date?: string
          mindmaps_created?: number
          is_anonymous?: boolean
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          date?: string
          mindmaps_created?: number
          is_anonymous?: boolean
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_daily_limit: {
        Args: {
          user_uuid?: string
          user_ip?: string
        }
        Returns: boolean
      }
      record_usage: {
        Args: {
          user_uuid?: string
          user_ip?: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 