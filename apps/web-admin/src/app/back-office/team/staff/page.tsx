'use client';

import * as React from 'react';
import { StaffView } from '@/views/staff-view';

export default function BackOfficeStaffPage() {
  return <StaffView initialTab="directory" initialMode="MANAGER" />;
}
