import { Classwork } from '@/types/classwork';
import { supabase, isSupabaseConfigured } from './supabase';
import { initialClassworks } from './initialData';

const LOCAL_STORAGE_KEY = 'auntie_orn_classworks_v1';

export async function fetchClassworks(): Promise<Classwork[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('classworks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, falling back to local data:', error.message);
      } else if (data && data.length > 0) {
        return data as Classwork[];
      } else if (data && data.length === 0) {
        // Table exists but empty, check if we should populate initial
        return [];
      }
    } catch (err) {
      console.warn('Failed to query Supabase, using local fallback:', err);
    }
  }

  // Fallback to localStorage (browser) or initialClassworks
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing local storage:', e);
      }
    }
    // Initialize local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialClassworks));
  }

  return initialClassworks;
}

export async function addClasswork(item: Omit<Classwork, 'id' | 'created_at'>): Promise<Classwork> {
  const newItem: Classwork = {
    ...item,
    id: `cw-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('classworks')
        .insert([
          {
            title: newItem.title,
            description: newItem.description,
            subject: newItem.subject,
            category: newItem.category,
            type: newItem.type,
            url: newItem.url,
            file_name: newItem.file_name,
            file_size: newItem.file_size,
            is_showcase: newItem.is_showcase,
            tags: newItem.tags,
            term: newItem.term || '1/2567',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      if (data) {
        // Also update local cache
        saveToLocalStorage(data as Classwork);
        return data as Classwork;
      }
    } catch (err) {
      console.error('Falling back to local save due to Supabase error:', err);
    }
  }

  // Local save
  saveToLocalStorage(newItem);
  return newItem;
}

export async function updateClasswork(id: string, updates: Partial<Classwork>): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('classworks')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Supabase update error:', error);
      }
    } catch (err) {
      console.error('Supabase update exception:', err);
    }
  }

  // Update localStorage
  if (typeof window !== 'undefined') {
    const list = await fetchClassworks();
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
}

export async function toggleShowcase(id: string, currentStatus: boolean): Promise<boolean> {
  const newStatus = !currentStatus;
  await updateClasswork(id, { is_showcase: newStatus });
  return newStatus;
}

export async function deleteClasswork(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('classworks').delete().eq('id', id);
      if (error) console.error('Supabase delete error:', error);
    } catch (err) {
      console.error('Supabase delete exception:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const list = await fetchClassworks();
    const filtered = list.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  }
}

function saveToLocalStorage(newItem: Classwork) {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list: Classwork[] = saved ? JSON.parse(saved) : [...initialClassworks];
    list.unshift(newItem);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }
}

export async function uploadFileToSupabase(file: File): Promise<{ url: string; fileName: string; fileSize: string }> {
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const fileSize = formatBytes(file.size);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('portfolio-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('portfolio-assets')
          .getPublicUrl(fileName);

        return {
          url: publicUrlData.publicUrl,
          fileName: file.name,
          fileSize,
        };
      } else {
        console.warn('Storage upload error, using local fallback:', error?.message);
      }
    } catch (err) {
      console.warn('Storage upload exception:', err);
    }
  }

  // Fallback: Read as Data URL so user can preview right away
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        fileName: file.name,
        fileSize,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
