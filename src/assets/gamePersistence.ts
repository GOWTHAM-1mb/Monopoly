import { supabase } from '../supabaseClient';

import { MonopolyMode } from './types';

export interface PlayerState {
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
}

export interface GameState {
    id: string;
    code: string;
    current_turn_id: string | null;
    game_started: boolean;
    selected_mode: MonopolyMode | null;
    players: PlayerState[];
}

class GamePersistence {
    private gameId: string | null = null;
    private gameCode: string | null = null;

    // Check if persistence is available
    isAvailable(): boolean {
        return supabase !== null;
    }

    // Create a new game session
    async createGame(code: string, selectedMode: MonopolyMode): Promise<string | null> {
        if (!supabase) return null;

        try {
            const { data, error } = await supabase
                .from('games')
                .insert({
                    code,
                    selected_mode: selectedMode,
                    game_started: false,
                })
                .select('id')
                .single();

            if (error) {
                console.error('Error creating game:', error);
                return null;
            }

            this.gameId = data.id;
            this.gameCode = code;
            console.log(`[Persistence] Game created with ID: ${this.gameId}`);
            return data.id;
        } catch (e) {
            console.error('Error creating game:', e);
            return null;
        }
    }

    // Find existing game by code
    async findGame(code: string): Promise<GameState | null> {
        if (!supabase) return null;

        try {
            const { data: game, error: gameError } = await supabase
                .from('games')
                .select('*')
                .eq('code', code)
                .single();

            if (gameError || !game) {
                return null;
            }

            const { data: players, error: playersError } = await supabase
                .from('players')
                .select('*')
                .eq('game_id', game.id);

            if (playersError) {
                console.error('Error fetching players:', playersError);
                return null;
            }

            this.gameId = game.id;
            this.gameCode = code;

            return {
                id: game.id,
                code: game.code,
                current_turn_id: game.current_turn_id,
                game_started: game.game_started,
                selected_mode: game.selected_mode,
                players: (players || []).map(p => ({
                    peer_id: p.peer_id,
                    username: p.username,
                    icon: p.icon,
                    position: p.position,
                    balance: p.balance,
                    properties: p.properties,
                    is_in_jail: p.is_in_jail,
                    jail_turns: p.jail_turns,
                    getout_cards: p.getout_cards,
                    is_connected: p.is_connected,
                    is_ready: p.is_ready,
                })),
            };
        } catch (e) {
            console.error('Error finding game:', e);
            return null;
        }
    }

    // Add or update a player in the current game
    async upsertPlayer(player: PlayerState): Promise<boolean> {
        if (!supabase || !this.gameId) return false;

        try {
            const { error } = await supabase
                .from('players')
                .upsert({
                    game_id: this.gameId,
                    peer_id: player.peer_id,
                    username: player.username,
                    icon: player.icon,
                    position: player.position,
                    balance: player.balance,
                    properties: player.properties,
                    is_in_jail: player.is_in_jail,
                    jail_turns: player.jail_turns,
                    getout_cards: player.getout_cards,
                    is_connected: player.is_connected,
                    is_ready: player.is_ready,
                }, {
                    onConflict: 'game_id,username',
                });

            if (error) {
                console.error('Error upserting player:', error);
                return false;
            }

            return true;
        } catch (e) {
            console.error('Error upserting player:', e);
            return false;
        }
    }

    // Update game state (turn, started status)
    async updateGameState(currentTurnId: string | null, gameStarted: boolean, selectedMode?: MonopolyMode): Promise<boolean> {
        if (!supabase || !this.gameId) return false;

        try {
            const updateData: any = {
                current_turn_id: currentTurnId,
                game_started: gameStarted,
            };

            if (selectedMode) {
                updateData.selected_mode = selectedMode;
            }

            const { error } = await supabase
                .from('games')
                .update(updateData)
                .eq('id', this.gameId);

            if (error) {
                console.error('Error updating game state:', error);
                return false;
            }

            return true;
        } catch (e) {
            console.error('Error updating game state:', e);
            return false;
        }
    }

    // Mark player as disconnected
    async setPlayerDisconnected(peerId: string): Promise<boolean> {
        if (!supabase || !this.gameId) return false;

        try {
            const { error } = await supabase
                .from('players')
                .update({ is_connected: false })
                .eq('game_id', this.gameId)
                .eq('peer_id', peerId);

            if (error) {
                console.error('Error marking player disconnected:', error);
                return false;
            }

            return true;
        } catch (e) {
            console.error('Error marking player disconnected:', e);
            return false;
        }
    }

    // Find player by username for rejoin
    async findPlayerByUsername(username: string): Promise<PlayerState | null> {
        if (!supabase || !this.gameId) return null;

        try {
            const { data, error } = await supabase
                .from('players')
                .select('*')
                .eq('game_id', this.gameId)
                .eq('username', username)
                .single();

            if (error || !data) {
                return null;
            }

            return {
                peer_id: data.peer_id,
                username: data.username,
                icon: data.icon,
                position: data.position,
                balance: data.balance,
                properties: data.properties,
                is_in_jail: data.is_in_jail,
                jail_turns: data.jail_turns,
                getout_cards: data.getout_cards,
                is_connected: data.is_connected,
                is_ready: data.is_ready,
            };
        } catch (e) {
            console.error('Error finding player:', e);
            return null;
        }
    }

    // Update player's peer_id on rejoin
    async updatePlayerPeerId(username: string, newPeerId: string): Promise<boolean> {
        if (!supabase || !this.gameId) return false;

        try {
            const { error } = await supabase
                .from('players')
                .update({ peer_id: newPeerId, is_connected: true })
                .eq('game_id', this.gameId)
                .eq('username', username);

            if (error) {
                console.error('Error updating player peer_id:', error);
                return false;
            }

            return true;
        } catch (e) {
            console.error('Error updating player peer_id:', e);
            return false;
        }
    }

    // Delete game (for cleanup)
    async deleteGame(): Promise<boolean> {
        if (!supabase || !this.gameId) return false;

        try {
            const { error } = await supabase
                .from('games')
                .delete()
                .eq('id', this.gameId);

            if (error) {
                console.error('Error deleting game:', error);
                return false;
            }

            this.gameId = null;
            this.gameCode = null;
            return true;
        } catch (e) {
            console.error('Error deleting game:', e);
            return false;
        }
    }

    getGameId(): string | null {
        return this.gameId;
    }

    getGameCode(): string | null {
        return this.gameCode;
    }
}

// Export singleton instance
export const gamePersistence = new GamePersistence();
