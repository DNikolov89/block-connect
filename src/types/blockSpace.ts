export interface BlockSpace {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  address: string;
  total_flats: number;
  total_floors: number;
  created_at: string;
  updated_at: string;
  status: 'active' | 'pending' | 'inactive';
  admin_ids: string[];
}

export interface BlockSpaceApplication {
  id: string;
  user_id: string;
  block_space_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  notes?: string;
}

export interface CreateBlockSpaceInput {
  name: string;
  description?: string;
  image_url?: string;
  address: string;
  total_flats: number;
  total_floors: number;
}

export interface UpdateBlockSpaceInput extends Partial<CreateBlockSpaceInput> {
  status?: BlockSpace['status'];
} 