export type WorkType = 'link' | 'photo' | 'file';

export interface Classwork {
  id: string;
  created_at?: string;
  title: string;
  description: string;
  subject: string;
  category: string;
  type: WorkType;
  url: string;
  file_name?: string;
  file_size?: string;
  is_showcase: boolean;
  tags: string[];
  term?: string;
}

export type FilterCategory = 'all' | 'showcase' | 'link' | 'photo' | 'file';
