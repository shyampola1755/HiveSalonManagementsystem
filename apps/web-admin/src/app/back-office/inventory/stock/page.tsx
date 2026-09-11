'use client';

import * as React from 'react';
import { InventoryView } from '@/views/inventory-view';

export default function BackOfficeStockPage() {
  return <InventoryView initialTab="stock" />;
}
