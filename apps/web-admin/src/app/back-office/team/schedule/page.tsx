'use client';

import * as React from 'react';
import { StaffView } from '@/views/staff-view';

export default function BackOfficeSchedulePage() {
  return <StaffView initialTab="roster" initialMode="MANAGER" />;
}
