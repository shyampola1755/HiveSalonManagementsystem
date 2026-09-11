'use client';

import * as React from 'react';
import { StaffView } from '@/views/staff-view';

export default function BackOfficeAttendancePage() {
  return <StaffView initialTab="attendance" initialMode="MANAGER" />;
}
