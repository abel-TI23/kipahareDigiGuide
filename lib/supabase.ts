/**
 * Supabase Client Configuration
 * Database operations for Ki Pahare DigiGuide
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.\n' +
    `NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'SET' : 'MISSING'}\n` +
    `NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'SET' : 'MISSING'}`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// DATABASE HELPER FUNCTIONS
// ============================================

export const supabaseDb = {
  // ==================== ARTIFACTS ====================
  
  async getAllArtifacts() {
    const { data, error } = await supabase
      .from('artifacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getArtifactById(id: number) {
    const { data, error } = await supabase
      .from('artifacts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createArtifact(artifact: {
    name: string;
    category: string;
    origin: string;
    year: string;
    description: string;
    image_url?: string;
    audio_url?: string;
  }) {
    const { data, error } = await supabase
      .from('artifacts')
      .insert([{
        name: artifact.name,
        category: artifact.category,
        origin: artifact.origin,
        year: artifact.year,
        description: artifact.description,
        image_url: artifact.image_url || '',
        audio_url: artifact.audio_url || '',
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateArtifact(id: number, artifact: {
    name?: string;
    category?: string;
    origin?: string;
    year?: string;
    description?: string;
    image_url?: string;
    audio_url?: string;
  }) {
    const { data, error } = await supabase
      .from('artifacts')
      .update({
        ...artifact,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteArtifact(id: number) {
    const { error } = await supabase
      .from('artifacts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true, id };
  },

  // ==================== USERS ====================
  
  async createUser(user: {
    username: string;
    password_hash: string;
    email: string;
  }) {
    const { data, error } = await supabase
      .from('admin_users')
      .insert([{
        username: user.username,
        password_hash: user.password_hash,
        email: user.email,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserByUsername(username: string) {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },
};

// ============================================
// STORAGE HELPER FUNCTIONS
// ============================================

export const supabaseStorage = {
  /**
   * Upload image to Supabase Storage
   * @param file - File object from input
   * @param folder - Optional folder name (default: 'artifacts')
   * @returns Public URL of uploaded image
   */
  async uploadImage(file: File, folder: string = 'artifacts'): Promise<string> {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('artifacts-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('artifacts-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  /**
   * Delete image from Supabase Storage
   * @param imageUrl - Full public URL of the image
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/artifacts-images/');
      
      if (pathParts.length < 2) {
        console.warn('Invalid image URL format:', imageUrl);
        return;
      }

      const filePath = pathParts[1];

      const { error } = await supabase.storage
        .from('artifacts-images')
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        throw new Error(`Failed to delete image: ${error.message}`);
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      // Don't throw - deletion failure shouldn't block other operations
    }
  },

  /**
   * Update image (delete old, upload new)
   * @param file - New file to upload
   * @param oldImageUrl - URL of old image to delete (optional)
   * @returns Public URL of new uploaded image
   */
  async updateImage(file: File, oldImageUrl?: string): Promise<string> {
    // Delete old image if exists
    if (oldImageUrl && oldImageUrl.includes('supabase')) {
      await this.deleteImage(oldImageUrl);
    }

    // Upload new image
    return await this.uploadImage(file);
  },
};
