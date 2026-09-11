'use client';

import * as React from 'react';
import { StaffView } from '@/views/staff-view';

export default function BackOfficeLeavePage() {
  return <StaffView initialTab="leaves" initialMode="MANAGER" />;
}
