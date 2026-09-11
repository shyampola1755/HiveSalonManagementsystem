'use client';

import * as React from 'react';
import { ServicesView } from '@/views/services-view';

export default function BackOfficeCategoriesPage() {
  return <ServicesView initialView="CATEGORIES" initialCategoryModalOpen={true} />;
}
