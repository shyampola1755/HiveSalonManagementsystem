/**
 * Global Command Palette & Search Types
 */

export type SearchCategory =
  | 'CUSTOMER'
  | 'APPOINTMENT'
  | 'INVOICE'
  | 'PRODUCT'
  | 'STAFF'
  | 'BRANCH'
  | 'MEMBERSHIP'
  | 'NAVIGATION';

export interface SearchResultItem {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle?: string;
  badge?: string;
  href?: string;
  avatarUrl?: string;
  icon?: string;
  metadata?: Record<string, string | number>;
}

export interface SearchGroup {
  category: SearchCategory;
  categoryLabel: string;
  items: SearchResultItem[];
}
