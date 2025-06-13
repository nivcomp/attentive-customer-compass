export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          activity_type: string
          created_at: string | null
          customer_id: number
          description: string | null
          id: number
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          customer_id: number
          description?: string | null
          id?: never
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          customer_id?: number
          description?: string | null
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: "activities_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_logs: {
        Row: {
          automation_id: string
          error_message: string | null
          executed_at: string
          id: string
          status: string
          triggered_by_id: string
          triggered_by_type: string
        }
        Insert: {
          automation_id: string
          error_message?: string | null
          executed_at?: string
          id?: string
          status: string
          triggered_by_id: string
          triggered_by_type: string
        }
        Update: {
          automation_id?: string
          error_message?: string | null
          executed_at?: string
          id?: string
          status?: string
          triggered_by_id?: string
          triggered_by_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
        ]
      }
      automations: {
        Row: {
          action_config: Json
          action_type: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          trigger_config: Json
          trigger_type: string
          updated_at: string
        }
        Insert: {
          action_config?: Json
          action_type: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          trigger_config?: Json
          trigger_type: string
          updated_at?: string
        }
        Update: {
          action_config?: Json
          action_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          trigger_config?: Json
          trigger_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      board_columns: {
        Row: {
          board_id: string | null
          column_order: number
          column_type: string
          created_at: string
          id: string
          is_required: boolean | null
          name: string
          options: Json | null
        }
        Insert: {
          board_id?: string | null
          column_order?: number
          column_type?: string
          created_at?: string
          id?: string
          is_required?: boolean | null
          name: string
          options?: Json | null
        }
        Update: {
          board_id?: string | null
          column_order?: number
          column_type?: string
          created_at?: string
          id?: string
          is_required?: boolean | null
          name?: string
          options?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "board_columns_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      board_items: {
        Row: {
          board_id: string | null
          created_at: string
          data: Json
          id: string
          item_order: number
          updated_at: string
        }
        Insert: {
          board_id?: string | null
          created_at?: string
          data?: Json
          id?: string
          item_order?: number
          updated_at?: string
        }
        Update: {
          board_id?: string | null
          created_at?: string
          data?: Json
          id?: string
          item_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "board_items_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      board_relationships: {
        Row: {
          created_at: string | null
          id: string
          relationship_type: string
          source_board_id: string | null
          source_field_name: string
          target_board_id: string | null
          target_field_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          relationship_type: string
          source_board_id?: string | null
          source_field_name: string
          target_board_id?: string | null
          target_field_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          relationship_type?: string
          source_board_id?: string | null
          source_field_name?: string
          target_board_id?: string | null
          target_field_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "board_relationships_source_board_id_fkey"
            columns: ["source_board_id"]
            isOneToOne: false
            referencedRelation: "dynamic_boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "board_relationships_target_board_id_fkey"
            columns: ["target_board_id"]
            isOneToOne: false
            referencedRelation: "dynamic_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      board_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          preview_image: string | null
          template_data: Json
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          preview_image?: string | null
          template_data?: Json
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          preview_image?: string | null
          template_data?: Json
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      board_views: {
        Row: {
          board_id: string | null
          created_at: string
          id: string
          is_default: boolean | null
          name: string
          settings: Json
          view_type: string
        }
        Insert: {
          board_id?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          name: string
          settings?: Json
          view_type?: string
        }
        Update: {
          board_id?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string
          settings?: Json
          view_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "board_views_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      boards: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: number
          name: string
          phone: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          name: string
          phone?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string
          phone?: string | null
          website?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          company_id: number | null
          created_at: string | null
          customer_id: number
          email: string
          id: number
          name: string
          phone: string | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string | null
          customer_id: number
          email: string
          id?: never
          name: string
          phone?: string | null
        }
        Update: {
          company_id?: number | null
          created_at?: string | null
          customer_id?: number
          email?: string
          id?: never
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_field_values: {
        Row: {
          created_at: string | null
          entity_id: number
          entity_type: string
          field_id: number | null
          field_value: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: number
          entity_type: string
          field_id?: number | null
          field_value?: string | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: number
          entity_type?: string
          field_id?: number | null
          field_value?: string | null
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_field_values_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "custom_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_fields: {
        Row: {
          created_at: string | null
          display_order: number | null
          entity_type: string
          field_name: string
          field_options: Json | null
          field_type: string
          id: number
          is_required: boolean | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          entity_type: string
          field_name: string
          field_options?: Json | null
          field_type: string
          id?: number
          is_required?: boolean | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          entity_type?: string
          field_name?: string
          field_options?: Json | null
          field_type?: string
          id?: number
          is_required?: boolean | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          company_name: string | null
          created_at: string | null
          customer_type: string | null
          email: string
          id: number
          lead_source: string | null
          name: string
          notes: string | null
          phone: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          customer_type?: string | null
          email: string
          id?: never
          lead_source?: string | null
          name: string
          notes?: string | null
          phone?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          customer_type?: string | null
          email?: string
          id?: never
          lead_source?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      deals: {
        Row: {
          amount: number
          created_at: string | null
          customer_id: number
          deal_name: string
          id: number
          status: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_id: number
          deal_name: string
          id?: never
          status: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_id?: number
          deal_name?: string
          id?: never
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "deals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      dynamic_board_columns: {
        Row: {
          board_id: string | null
          column_order: number
          column_type: string
          created_at: string | null
          display_settings: Json | null
          id: string
          is_required: boolean | null
          linked_board_id: string | null
          name: string
          options: Json | null
          validation_rules: Json | null
        }
        Insert: {
          board_id?: string | null
          column_order?: number
          column_type?: string
          created_at?: string | null
          display_settings?: Json | null
          id?: string
          is_required?: boolean | null
          linked_board_id?: string | null
          name: string
          options?: Json | null
          validation_rules?: Json | null
        }
        Update: {
          board_id?: string | null
          column_order?: number
          column_type?: string
          created_at?: string | null
          display_settings?: Json | null
          id?: string
          is_required?: boolean | null
          linked_board_id?: string | null
          name?: string
          options?: Json | null
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "dynamic_board_columns_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "dynamic_boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dynamic_board_columns_linked_board_id_fkey"
            columns: ["linked_board_id"]
            isOneToOne: false
            referencedRelation: "dynamic_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      dynamic_board_items: {
        Row: {
          board_id: string | null
          created_at: string | null
          data: Json
          id: string
          item_order: number
          updated_at: string | null
        }
        Insert: {
          board_id?: string | null
          created_at?: string | null
          data?: Json
          id?: string
          item_order?: number
          updated_at?: string | null
        }
        Update: {
          board_id?: string | null
          created_at?: string | null
          data?: Json
          id?: string
          item_order?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dynamic_board_items_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "dynamic_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      dynamic_boards: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      item_relationships: {
        Row: {
          created_at: string | null
          id: string
          relationship_id: string | null
          source_item_id: string | null
          target_item_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          relationship_id?: string | null
          source_item_id?: string | null
          target_item_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          relationship_id?: string | null
          source_item_id?: string | null
          target_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_relationships_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "board_relationships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_relationships_source_item_id_fkey"
            columns: ["source_item_id"]
            isOneToOne: false
            referencedRelation: "dynamic_board_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_relationships_target_item_id_fkey"
            columns: ["target_item_id"]
            isOneToOne: false
            referencedRelation: "dynamic_board_items"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          converted_at: string | null
          converted_to_board_id: string | null
          converted_to_item_id: string | null
          created_at: string | null
          id: string
          name: string
          notes: string | null
          rating: number | null
          source: string
          status: string
          updated_at: string | null
        }
        Insert: {
          converted_at?: string | null
          converted_to_board_id?: string | null
          converted_to_item_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          rating?: number | null
          source?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          converted_at?: string | null
          converted_to_board_id?: string | null
          converted_to_item_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          rating?: number | null
          source?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_converted_to_board_id_fkey"
            columns: ["converted_to_board_id"]
            isOneToOne: false
            referencedRelation: "dynamic_boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_converted_to_item_id_fkey"
            columns: ["converted_to_item_id"]
            isOneToOne: false
            referencedRelation: "dynamic_board_items"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_users: {
        Row: {
          id: string
          joined_at: string | null
          organization_id: string
          role: string
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          organization_id: string
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          organization_id?: string
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          settings: Json | null
          subdomain: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          settings?: Json | null
          subdomain: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          settings?: Json | null
          subdomain?: string
        }
        Relationships: []
      }
      tenants: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          schema_name: string
          subdomain: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          schema_name: string
          subdomain: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          schema_name?: string
          subdomain?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_organization: {
        Args: { org_name: string; org_subdomain: string }
        Returns: string
      }
      create_tenant_schema: {
        Args: { tenant_name: string; tenant_subdomain: string }
        Returns: string
      }
      get_tenant_by_subdomain: {
        Args: { tenant_subdomain: string }
        Returns: {
          id: string
          name: string
          schema_name: string
          subdomain: string
          is_active: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
