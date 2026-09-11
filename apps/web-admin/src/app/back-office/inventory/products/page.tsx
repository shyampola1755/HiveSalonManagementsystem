'use client';

import * as React from 'react';
import { InventoryView } from '@/views/inventory-view';

export default function BackOfficeProductsPage() {
  return <InventoryView initialTab="products" />;
}
