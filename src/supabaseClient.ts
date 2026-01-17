import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Game persistence will be disabled.');
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Type definitions for our database tables
export interface GameRow {
    id: string;
    code: string;
    current_turn_id: string | null;
    game_started: boolean;
    selected_mode: any;
    created_at: string;
    updated_at: string;
}

export interface PlayerRow {
    id: string;
    game_id: string;
    peer_id: string;
    username: string;
    icon: number;
    position: number;
    balance: number;
    properties: any[];
    is_in_jail: boolean;
    jail_turns: number;
    getout_cards: number;
    is_connected: boolean;
    is_ready: boolean;
    created_at: string;
    updated_at: string;
}
