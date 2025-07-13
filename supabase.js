import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

// Memo operations
export const memoOperations = {
    // Save a new memo
    async saveMemo(memo) {
        const { data, error } = await supabase
            .from('memos')
            .insert([{
                title: memo.title,
                category: memo.category,
                content: memo.content,
                latitude: memo.location.lat,
                longitude: memo.location.lng,
                accuracy: memo.location.accuracy,
                user_id: memo.userId,
                created_at: new Date().toISOString()
            }])
        
        if (error) throw error
        return data
    },

    // Get all memos for a user
    async getMemos(userId) {
        const { data, error } = await supabase
            .from('memos')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
        
        if (error) throw error
        return data.map(memo => ({
            id: memo.id,
            title: memo.title,
            category: memo.category,
            content: memo.content,
            location: {
                lat: memo.latitude,
                lng: memo.longitude,
                accuracy: memo.accuracy
            },
            timestamp: memo.created_at
        }))
    },

    // Delete a memo
    async deleteMemo(memoId, userId) {
        const { error } = await supabase
            .from('memos')
            .delete()
            .eq('id', memoId)
            .eq('user_id', userId)
        
        if (error) throw error
    }
}

// Authentication operations
export const authOperations = {
    // Sign up a new user
    async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })
        if (error) throw error
        return data
    },

    // Sign in a user
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) throw error
        return data
    },

    // Sign out the current user
    async signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },

    // Get the current user
    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
    }
} 