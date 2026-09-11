'use client';

import * as React from 'react';
import {
  PageHeader,
  Search,
  Button,
  Badge,
  Modal,
  Input,
  useToast,
} from '@hive/ui';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  Users,
  Building2,
  Scissors,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Phone,
  Tag,
  Eye,
  Edit2,
  Trash2,
  Check,
  X,
  Play,
  Bell,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  FileText,
  DollarSign,
  Layers,
  Send,
  Sparkles,
} from 'lucide-react';
import { formatCurrency } from '@hive/utilities';
import type {
  AppointmentItem,
  AppointmentStatus,
  QueueStatus,
  CalendarViewMode,
  QueueTicketItem,
  CreateAppointmentDto,
  CreateWalkInDto,
} from '@hive/types';

// Mock Branch and Staff Metadata
const branchesList = [
  { id: 'br-jubilee', name: 'Jubilee Hills Flagship', code: 'HYD-JUB-01', city: 'Hyderabad', tier: 'Tier 1 Luxury' },
  { id: 'br-banjara', name: 'Banjara Hills Premium', code: 'HYD-BAN-02', city: 'Hyderabad', tier: 'Tier 1 Premium' },
  { id: 'br-hitech', name: 'Hitech City Studio', code: 'HYD-HIT-03', city: 'Hyderabad', tier: 'Tier 2 Studio' },
];

const staffList = [
  { id: 'st-1', name: 'Aarav Mehta', role: 'Master Stylist', branchId: 'br-jubilee', branchName: 'Jubilee Hills Flagship', avatar: 'AM', chair: 'Chair #1' },
  { id: 'st-2', name: 'Pooja Hegde', role: 'Senior Colorist', branchId: 'br-jubilee', branchName: 'Jubilee Hills Flagship', avatar: 'PH', chair: 'Color Bar' },
  { id: 'st-3', name: 'Vikram Sethi', role: 'Senior Barber', branchId: 'br-jubilee', branchName: 'Jubilee Hills Flagship', avatar: 'VS', chair: 'Chair #3' },
  { id: 'st-4', name: 'Ananya Roy', role: 'Lead Aesthetician', branchId: 'br-jubilee', branchName: 'Jubilee Hills Flagship', avatar: 'AR', chair: 'Medi-Spa 1' },
  { id: 'st-5', name: 'David Jones', role: 'Spa Therapist', branchId: 'br-banjara', branchName: 'Banjara Hills Premium', avatar: 'DJ', chair: 'Spa Suite' },
  { id: 'st-6', name: 'Meera Nambiar', role: 'Senior Nail Artist', branchId: 'br-jubilee', branchName: 'Jubilee Hills Flagship', avatar: 'MN', chair: 'Nail Station 1' },
];

const servicesList = [
  { id: 'srv-1', name: 'Signature Royal Haircut & Beard Sculpting', category: 'Hair', duration: 45, buffer: 15, price: 850 },
  { id: 'srv-2', name: 'Balayage & Multi-Dimensional Glaze', category: 'Hair Color', duration: 150, buffer: 30, price: 6800 },
  { id: 'srv-3', name: 'Hydra-Oxygen Rejuvenation Medi-Facial', category: 'Facial', duration: 60, buffer: 15, price: 3400 },
  { id: 'srv-4', name: 'Balinese Aromatic Deep Tissue Therapy', category: 'Massage', duration: 75, buffer: 20, price: 3900 },
  { id: 'srv-5', name: 'Russian Gel Nail Architecture & Art', category: 'Nails', duration: 90, buffer: 15, price: 2600 },
  { id: 'srv-6', name: 'Cysteine Protein Anti-Frizz Ritual', category: 'Hair Treatment', duration: 120, buffer: 20, price: 5800 },
];

const initialAppointments: AppointmentItem[] = [
  {
    id: 'apt-001',
    appointmentNumber: 'APT-20260910-001',
    organizationId: 'org_hive_demo',
    branchId: 'br-jubilee',
    branchName: 'Jubilee Hills Flagship',
    customerId: 'c1',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'priya.sharma@example.com',
    staffId: 'st-1',
    staffName: 'Aarav Mehta',
    staffRole: 'Master Stylist',
    serviceId: 'srv-2',
    serviceName: 'Balayage & Multi-Dimensional Glaze',
    startTime: '2026-09-10T10:00:00.000Z',
    endTime: '2026-09-10T12:30:00.000Z',
    status: 'IN_PROGRESS',
    isWalkIn: false,
    queueToken: null,
    queueStatus: null,
    checkedInAt: '2026-09-10T09:50:00.000Z',
    serviceStartedAt: '2026-09-10T10:05:00.000Z',
    serviceCompletedAt: null,
    cancelledAt: null,
    cancellationReason: null,
    bufferMinutes: 30,
    totalDurationMinutes: 150,
    subtotal: 6800,
    taxAmount: 1224,
    totalAmount: 8024,
    source: 'ONLINE_PORTAL',
    paymentStatus: 'PAID',
    notes: 'Client has warm undertones. Use Olaplex No. 2 bond treatment.',
    clientPreferences: 'Prefers quiet sessions, warm green tea.',
    chairNumber: 'Chair #1',
    createdAt: '2026-09-09T14:30:00.000Z',
    updatedAt: '2026-09-10T10:05:00.000Z',
  },
  {
    id: 'apt-002',
    appointmentNumber: 'APT-20260910-002',
    organizationId: 'org_hive_demo',
    branchId: 'br-jubilee',
    branchName: 'Jubilee Hills Flagship',
    customerId: 'c2',
    customerName: 'Rahul Verma',
    customerPhone: '+91 98111 22334',
    customerEmail: 'rahul.verma@example.com',
    staffId: 'st-3',
    staffName: 'Vikram Sethi',
    staffRole: 'Senior Stylist',
    serviceId: 'srv-1',
    serviceName: 'Signature Royal Haircut & Beard Sculpting',
    startTime: '2026-09-10T11:30:00.000Z',
    endTime: '2026-09-10T12:15:00.000Z',
    status: 'ARRIVED',
    isWalkIn: false,
    queueToken: null,
    queueStatus: 'WAITING',
    checkedInAt: '2026-09-10T11:22:00.000Z',
    serviceStartedAt: null,
    serviceCompletedAt: null,
    cancelledAt: null,
    cancellationReason: null,
    bufferMinutes: 15,
    totalDurationMinutes: 45,
    subtotal: 850,
    taxAmount: 153,
    totalAmount: 1003,
    source: 'FRONT_DESK',
    paymentStatus: 'PENDING',
    notes: 'Requested low skin fade and beard contour.',
    clientPreferences: 'Prefers fast turnaround.',
    chairNumber: 'Chair #3',
    createdAt: '2026-09-10T09:00:00.000Z',
    updatedAt: '2026-09-10T11:22:00.000Z',
  },
  {
    id: 'apt-003',
    appointmentNumber: 'APT-20260910-003',
    organizationId: 'org_hive_demo',
    branchId: 'br-jubilee',
    branchName: 'Jubilee Hills Flagship',
    customerId: 'c3',
    customerName: 'Ananya Roy',
    customerPhone: '+91 99887 76655',
    customerEmail: 'ananya.roy@example.com',
    staffId: 'st-4',
    staffName: 'Ananya Roy',
    staffRole: 'Lead Aesthetician',
    serviceId: 'srv-3',
    serviceName: 'Hydra-Oxygen Rejuvenation Medi-Facial',
    startTime: '2026-09-10T14:00:00.000Z',
    endTime: '2026-09-10T15:00:00.000Z',
    status: 'CONFIRMED',
    isWalkIn: false,
    queueToken: null,
    queueStatus: null,
    checkedInAt: null,
    serviceStartedAt: null,
    serviceCompletedAt: null,
    cancelledAt: null,
    cancellationReason: null,
    bufferMinutes: 15,
    totalDurationMinutes: 60,
    subtotal: 3400,
    taxAmount: 612,
    totalAmount: 4012,
    source: 'MOBILE_APP',
    paymentStatus: 'PENDING',
    notes: 'Pre-event skin prep. Extra suction on T-zone.',
    clientPreferences: 'Prefers lavender aromatherapy mist.',
    chairNumber: 'Medi-Spa Room 2',
    createdAt: '2026-09-08T18:20:00.000Z',
    updatedAt: '2026-09-08T18:20:00.000Z',
  },
  {
    id: 'apt-004',
    appointmentNumber: 'APT-20260910-W01',
    organizationId: 'org_hive_demo',
    branchId: 'br-jubilee',
    branchName: 'Jubilee Hills Flagship',
    customerId: 'c4',
    customerName: 'Kavita Reddy',
    customerPhone: '+91 97000 11223',
    customerEmail: null,
    staffId: 'st-6',
    staffName: 'Meera Nambiar',
    staffRole: 'Senior Nail Artist',
    serviceId: 'srv-5',
    serviceName: 'Russian Gel Nail Architecture & Art',
    startTime: '2026-09-10T11:45:00.000Z',
    endTime: '2026-09-10T13:15:00.000Z',
    status: 'ARRIVED',
    isWalkIn: true,
    queueToken: 'W-01',
    queueStatus: 'WAITING',
    checkedInAt: '2026-09-10T11:40:00.000Z',
    serviceStartedAt: null,
    serviceCompletedAt: null,
    cancelledAt: null,
    cancellationReason: null,
    bufferMinutes: 15,
    totalDurationMinutes: 90,
    subtotal: 2600,
    taxAmount: 468,
    totalAmount: 3068,
    source: 'WALK_IN',
    paymentStatus: 'PENDING',
    notes: 'Walk-in guest. French tips with chrome shimmer.',
    clientPreferences: null,
    chairNumber: 'Nail Station 1',
    createdAt: '2026-09-10T11:40:00.000Z',
    updatedAt: '2026-09-10T11:40:00.000Z',
  },
];

const timeHours = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
];

export default function AppointmentsPage() {
  const toast = useToast();

  // State
  const [appointments, setAppointments] = React.useState<AppointmentItem[]>(initialAppointments);
  const [activeTab, setActiveTab] = React.useState<'calendar' | 'queue'>('calendar');
  const [viewMode, setViewMode] = React.useState<CalendarViewMode>('day');
  const [selectedBranchId, setSelectedBranchId] = React.useState<string>('br-jubilee');
  const [selectedStaffFilter, setSelectedStaffFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [selectedDate, setSelectedDate] = React.useState<string>('2026-09-10');

  // Modals State
  const [isBookModalOpen, setIsBookModalOpen] = React.useState(false);
  const [bookStep, setBookStep] = React.useState<number>(1);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = React.useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [selectedApt, setSelectedApt] = React.useState<AppointmentItem | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = React.useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState('');
  // Auto-open modal on quick action
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('action') === 'new-appointment') {
        setIsBookModalOpen(true);
      }

      const handleQuickAction = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail?.id === 'act-new-appointment') {
          setIsBookModalOpen(true);
        }
      };
      window.addEventListener('hive:quick-action', handleQuickAction);
      return () => window.removeEventListener('hive:quick-action', handleQuickAction);
    }
  }, []);

  // Booking Form State
  const [bookCustomerName, setBookCustomerName] = React.useState('');
  const [bookCustomerPhone, setBookCustomerPhone] = React.useState('');
  const [bookBranchId, setBookBranchId] = React.useState('br-jubilee');
  const [bookServiceIds, setBookServiceIds] = React.useState<string[]>(['srv-1']);
  const [bookStaffId, setBookStaffId] = React.useState('st-1');
  const [bookDate, setBookDate] = React.useState('2026-09-10');
  const [bookTime, setBookTime] = React.useState('14:30');
  const [bookNotes, setBookNotes] = React.useState('');
  const [bookReminders, setBookReminders] = React.useState({ h24: true, h2: true });

  // Walk-in Form State
  const [walkInName, setWalkInName] = React.useState('');
  const [walkInPhone, setWalkInPhone] = React.useState('');
  const [walkInServiceId, setWalkInServiceId] = React.useState('srv-1');
  const [walkInStaffId, setWalkInStaffId] = React.useState('');

  // Reschedule Form State
  const [rescheduleDate, setRescheduleDate] = React.useState('2026-09-11');
  const [rescheduleTime, setRescheduleTime] = React.useState('15:00');
  const [rescheduleStaffId, setRescheduleStaffId] = React.useState('');

  // Double Booking Collision Detection Helper
  const checkCollisionClient = (staffId: string, startTimeIso: string, durationMin: number, bufferMin: number, excludeId?: string) => {
    const newStart = new Date(startTimeIso).getTime();
    const newEndWithBuffer = newStart + (durationMin + bufferMin) * 60000;

    const conflict = appointments.find((a) => {
      if (a.id === excludeId) return false;
      if (a.staffId !== staffId) return false;
      if (a.status === 'CANCELLED' || a.status === 'NO_SHOW') return false;

      const exStart = new Date(a.startTime).getTime();
      const exEndWithBuffer = new Date(a.endTime).getTime() + (a.bufferMinutes || 0) * 60000;

      return Math.max(newStart, exStart) < Math.min(newEndWithBuffer, exEndWithBuffer);
    });

    return conflict;
  };

  // Status Badge Formatter
  const renderStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <Badge variant="warning" showDot>IN SERVICE</Badge>;
      case 'ARRIVED':
        return <Badge variant="success" showDot>ARRIVED / WAITING</Badge>;
      case 'CONFIRMED':
        return <Badge variant="default">CONFIRMED</Badge>;
      case 'BOOKED':
        return <Badge variant="outline">BOOKED</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">COMPLETED</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">CANCELLED</Badge>;
      case 'NO_SHOW':
        return <Badge variant="destructive">NO SHOW</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Booking Flow Submit
  const handleSaveBooking = () => {
    if (!bookCustomerName.trim() || !bookCustomerPhone.trim()) {
      toast.error('Client details required', 'Please provide client name and 10-digit mobile number.');
      return;
    }

    const startDateTimeIso = `${bookDate}T${bookTime}:00.000Z`;
    const selectedSrvs = servicesList.filter((s) => bookServiceIds.includes(s.id));
    const totalDuration = selectedSrvs.reduce((acc, s) => acc + s.duration, 0) || 45;
    const totalBuffer = 15;
    const subtotal = selectedSrvs.reduce((acc, s) => acc + s.price, 0) || 850;
    const tax = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + tax;

    // Double Booking Collision Check
    const conflict = checkCollisionClient(bookStaffId, startDateTimeIso, totalDuration, totalBuffer);
    if (conflict) {
      toast.error(
        'Double Booking Conflict Detected!',
        `Stylist ${conflict.staffName} already has appointment "${conflict.appointmentNumber}" overlapping this slot. Please select a different time or stylist.`
      );
      return;
    }

    const assignedStaff = staffList.find((s) => s.id === bookStaffId);
    const assignedBranch = branchesList.find((b) => b.id === bookBranchId);
    const aptNumber = `APT-${bookDate.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    const newAppointment: AppointmentItem = {
      id: `apt-${Date.now()}`,
      appointmentNumber: aptNumber,
      organizationId: 'org_hive_demo',
      branchId: bookBranchId,
      branchName: assignedBranch?.name || 'Jubilee Hills Flagship',
      customerId: `c-${Date.now()}`,
      customerName: bookCustomerName.trim(),
      customerPhone: bookCustomerPhone.trim(),
      customerEmail: null,
      staffId: bookStaffId,
      staffName: assignedStaff?.name || 'Aarav Mehta',
      staffRole: assignedStaff?.role || 'Master Stylist',
      serviceId: bookServiceIds[0] || 'srv-1',
      serviceName: selectedSrvs.map((s) => s.name).join(' + ') || 'Salon Service',
      startTime: startDateTimeIso,
      endTime: new Date(new Date(startDateTimeIso).getTime() + totalDuration * 60000).toISOString(),
      status: 'BOOKED',
      isWalkIn: false,
      queueToken: null,
      queueStatus: null,
      checkedInAt: null,
      serviceStartedAt: null,
      serviceCompletedAt: null,
      cancelledAt: null,
      cancellationReason: null,
      bufferMinutes: totalBuffer,
      totalDurationMinutes: totalDuration,
      subtotal,
      taxAmount: tax,
      totalAmount: grandTotal,
      source: 'FRONT_DESK',
      paymentStatus: 'PENDING',
      notes: bookNotes.trim() || null,
      clientPreferences: null,
      chairNumber: assignedStaff?.chair || 'Chair #1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAppointments([newAppointment, ...appointments]);
    setIsBookModalOpen(false);
    toast.success(
      'Appointment Confirmed',
      `Booking ${aptNumber} registered for ${bookCustomerName} on ${bookDate} at ${bookTime}. 24h & 2h WhatsApp reminders scheduled.`
    );
  };

  // Walk-in Submit
  const handleSaveWalkIn = () => {
    if (!walkInName.trim() || !walkInPhone.trim()) {
      toast.error('Guest details required', 'Please provide walk-in guest name and contact number.');
      return;
    }

    const srv = servicesList.find((s) => s.id === walkInServiceId) || servicesList[0];
    const token = `W-0${appointments.filter((a) => a.isWalkIn).length + 1}`;
    const staff = staffList.find((s) => s.id === walkInStaffId) || staffList[2];
    const subtotal = srv.price;
    const tax = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + tax;
    const nowIso = new Date().toISOString();

    const walkInApt: AppointmentItem = {
      id: `apt-w-${Date.now()}`,
      appointmentNumber: `APT-WALK-${token}`,
      organizationId: 'org_hive_demo',
      branchId: selectedBranchId,
      branchName: branchesList.find((b) => b.id === selectedBranchId)?.name || 'Jubilee Hills Flagship',
      customerId: `c-walk-${Date.now()}`,
      customerName: walkInName.trim(),
      customerPhone: walkInPhone.trim(),
      customerEmail: null,
      staffId: staff.id,
      staffName: staff.name,
      staffRole: staff.role,
      serviceId: srv.id,
      serviceName: srv.name,
      startTime: nowIso,
      endTime: new Date(Date.now() + srv.duration * 60000).toISOString(),
      status: 'ARRIVED',
      isWalkIn: true,
      queueToken: token,
      queueStatus: 'WAITING',
      checkedInAt: nowIso,
      serviceStartedAt: null,
      serviceCompletedAt: null,
      cancelledAt: null,
      cancellationReason: null,
      bufferMinutes: srv.buffer,
      totalDurationMinutes: srv.duration,
      subtotal,
      taxAmount: tax,
      totalAmount: grandTotal,
      source: 'WALK_IN',
      paymentStatus: 'PENDING',
      notes: 'Walk-in guest queue intake.',
      clientPreferences: null,
      chairNumber: 'Lounge Waiting',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    setAppointments([walkInApt, ...appointments]);
    setIsWalkInModalOpen(false);
    setWalkInName('');
    setWalkInPhone('');
    toast.success(
      `Walk-in Token ${token} Issued!`,
      `${walkInApt.customerName} placed in live queue for ${walkInApt.serviceName}. Estimated wait: 15 mins.`
    );
  };

  // Check-In Action
  const handleCheckIn = (apt: AppointmentItem) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === apt.id) {
          return {
            ...a,
            status: 'ARRIVED',
            checkedInAt: new Date().toISOString(),
            queueStatus: a.isWalkIn ? 'WAITING' : null,
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );
    toast.success(
      'Guest Checked In',
      `${apt.customerName} marked as ARRIVED. Waiting timer started on front desk dashboard.`
    );
  };

  // Queue Stage Transition
  const handleQueueTransition = (aptId: string, nextStatus: QueueStatus) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === aptId) {
          const nowIso = new Date().toISOString();
          let aptStatus: AppointmentStatus = a.status;
          let startedAt = a.serviceStartedAt;
          let completedAt = a.serviceCompletedAt;

          if (nextStatus === 'CALLED') {
            aptStatus = 'ARRIVED';
          } else if (nextStatus === 'IN_SERVICE') {
            aptStatus = 'IN_PROGRESS';
            startedAt = nowIso;
          } else if (nextStatus === 'COMPLETED') {
            aptStatus = 'COMPLETED';
            completedAt = nowIso;
          }

          return {
            ...a,
            queueStatus: nextStatus,
            status: aptStatus,
            serviceStartedAt: startedAt,
            serviceCompletedAt: completedAt,
            updatedAt: nowIso,
          };
        }
        return a;
      })
    );

    toast.info(`Queue Status: ${nextStatus}`, `Guest status updated to ${nextStatus}.`);
  };

  // Reschedule Action
  const handleSaveReschedule = () => {
    if (!selectedApt) return;
    const newStartIso = `${rescheduleDate}T${rescheduleTime}:00.000Z`;
    const targetStaffId = rescheduleStaffId || selectedApt.staffId;

    const conflict = checkCollisionClient(
      targetStaffId,
      newStartIso,
      selectedApt.totalDurationMinutes,
      selectedApt.bufferMinutes,
      selectedApt.id
    );

    if (conflict) {
      toast.error(
        'Reschedule Slot Conflict!',
        `Stylist already has booking "${conflict.appointmentNumber}" overlapping this slot. Please pick another time.`
      );
      return;
    }

    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === selectedApt.id) {
          const newStart = new Date(newStartIso);
          const newEnd = new Date(newStart.getTime() + a.totalDurationMinutes * 60000);
          const staff = staffList.find((s) => s.id === targetStaffId);
          return {
            ...a,
            startTime: newStart.toISOString(),
            endTime: newEnd.toISOString(),
            staffId: targetStaffId,
            staffName: staff?.name || a.staffName,
            status: 'CONFIRMED',
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );

    setIsRescheduleModalOpen(false);
    toast.success('Appointment Rescheduled', `Updated to ${rescheduleDate} at ${rescheduleTime}. Cancellation notice and new confirmation sent.`);
  };

  // Cancel Action
  const handleSaveCancel = () => {
    if (!selectedApt) return;
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === selectedApt.id) {
          return {
            ...a,
            status: 'CANCELLED',
            cancelledAt: new Date().toISOString(),
            cancellationReason: cancelReason.trim() || 'Client requested cancellation',
            queueStatus: 'CANCELLED',
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );

    setIsCancelModalOpen(false);
    setCancelReason('');
    toast.info('Appointment Cancelled', `Appointment ${selectedApt.appointmentNumber} has been cancelled.`);
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((a) => {
    if (selectedBranchId !== 'all' && a.branchId !== selectedBranchId) {
      return false;
    }
    if (selectedStaffFilter !== 'all' && a.staffId !== selectedStaffFilter) {
      return false;
    }
    if (statusFilter !== 'all' && a.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCust = a.customerName.toLowerCase().includes(q) || a.customerPhone.includes(q);
      const matchStaff = a.staffName.toLowerCase().includes(q);
      const matchSrv = a.serviceName.toLowerCase().includes(q);
      const matchNum = a.appointmentNumber.toLowerCase().includes(q);
      if (!matchCust && !matchStaff && !matchSrv && !matchNum) return false;
    }
    return true;
  });

  // Live Queue Tickets
  const queueTickets = appointments.filter(
    (a) => a.queueStatus && a.queueStatus !== 'CANCELLED' && (selectedBranchId === 'all' || a.branchId === selectedBranchId)
  );

  return (
    <div className="space-y-6 p-6">
      {/* 1. Header & Primary Scheduling Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-amber-100 p-2 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              <CalendarIcon className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Appointment Scheduling & Live Queue
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Multi-branch calendar, double-booking collision prevention, stylist chair availability, and walk-in token engine.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsWalkInModalOpen(true)}
            className="flex items-center gap-1.5 border-amber-500 text-amber-700 hover:bg-amber-50 dark:text-amber-400"
          >
            <Flame className="h-4 w-4 text-amber-600" />
            + Walk-in Guest (Token)
          </Button>
          <Button
            onClick={() => {
              setBookStep(1);
              setIsBookModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Book New Appointment
          </Button>
        </div>
      </div>

      {/* 2. Top Metric Ribbon */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today's Bookings</span>
            <CalendarIcon className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {appointments.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">100% Scheduled</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active In Service</span>
            <Scissors className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-purple-600">
            {appointments.filter((a) => a.status === 'IN_PROGRESS').length}
          </div>
          <span className="text-[11px] text-slate-500">Chairs Occupied</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Arrived / Waiting</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-600">
            {appointments.filter((a) => a.status === 'ARRIVED').length}
          </div>
          <span className="text-[11px] text-blue-600 font-medium">In Lounge Queue</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Walk-ins Today</span>
            <Flame className="h-4 w-4 text-orange-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-orange-600">
            {appointments.filter((a) => a.isWalkIn).length}
          </div>
          <span className="text-[11px] text-orange-600 font-medium">Tokens Issued</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Est. Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">
            ₹{appointments.reduce((acc, a) => acc + (a.status !== 'CANCELLED' ? a.totalAmount : 0), 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">18% GST Included</span>
        </div>
      </div>

      {/* 3. Branch & Navigation Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Main Tab Switcher */}
          <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'calendar'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              Calendar Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('queue')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'queue'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Flame className="h-3.5 w-3.5" />
              Live Walk-in Queue
              {queueTickets.length > 0 && (
                <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] text-white">
                  {queueTickets.length}
                </span>
              )}
            </button>
          </div>

          {/* Branch Dropdown */}
          <select
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
          >
            <option value="all">🏢 All Branches</option>
            {branchesList.map((b) => (
              <option key={b.id} value={b.id}>
                📍 {b.name} ({b.city})
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Switcher (Day, Week, Month, Staff, Branch) */}
        {activeTab === 'calendar' && (
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
            {(['day', 'week', 'month', 'staff', 'branch'] as CalendarViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {mode} View
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Filter Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 max-w-md">
          <Search
            placeholder="Search client name, mobile, stylist, appointment #..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Stylist Filter */}
          <select
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            value={selectedStaffFilter}
            onChange={(e) => setSelectedStaffFilter(e.target.value)}
          >
            <option value="all">All Stylists & Staff</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                👤 {s.name} ({s.role})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="BOOKED">Booked</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ARRIVED">Arrived / In Lounge</option>
            <option value="IN_PROGRESS">In Service</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* 5. MAIN TAB CONTENT: Calendar vs Queue */}
      {activeTab === 'calendar' ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Calendar Header with Date Navigation */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Thursday, September 10, 2026
              </h2>
              <Badge variant="default">Today</Badge>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                Today
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* DAY VIEW TIMELINE */}
          {viewMode === 'day' && (
            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {timeHours.map((hour) => {
                const hourNum = parseInt(hour.split(':')[0], 10);
                const isPm = hour.includes('PM') && hourNum !== 12;
                const normalizedHour = isPm ? hourNum + 12 : hourNum === 12 && hour.includes('AM') ? 0 : hourNum;

                // Match appointments in this hour window
                const hourApts = filteredAppointments.filter((a) => {
                  const aptHour = new Date(a.startTime).getUTCHours();
                  return aptHour === normalizedHour;
                });

                return (
                  <div key={hour} className="group flex items-start gap-4 py-3">
                    <div className="w-20 shrink-0 text-right text-xs font-bold text-slate-400">
                      {hour}
                    </div>

                    <div className="flex-1 space-y-2">
                      {hourApts.length === 0 ? (
                        <div className="h-8 rounded-lg border border-dashed border-slate-100 transition-colors group-hover:border-slate-200 dark:border-slate-800/40" />
                      ) : (
                        hourApts.map((apt) => (
                          <div
                            key={apt.id}
                            className={`flex flex-col justify-between gap-2 rounded-xl border p-3.5 shadow-sm transition-all sm:flex-row sm:items-center ${
                              apt.status === 'IN_PROGRESS'
                                ? 'border-purple-300 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20'
                                : apt.status === 'ARRIVED'
                                ? 'border-blue-300 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20'
                                : apt.status === 'CONFIRMED'
                                ? 'border-amber-300 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20'
                                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                                  {apt.customerName}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {apt.appointmentNumber}
                                </span>
                                {renderStatusBadge(apt.status)}
                                {apt.isWalkIn && (
                                  <Badge variant="warning" className="text-[9px]">
                                    TOKEN {apt.queueToken}
                                  </Badge>
                                )}
                              </div>

                              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  ✂️ {apt.serviceName}
                                </span>
                                <span>•</span>
                                <span>👤 Stylist: <strong>{apt.staffName}</strong> ({apt.chairNumber || 'Chair #1'})</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {apt.totalDurationMinutes}m + {apt.bufferMinutes}m buffer
                                </span>
                                <span>•</span>
                                <span className="font-bold text-emerald-600">
                                  ₹{apt.totalAmount.toLocaleString('en-IN')}
                                </span>
                              </div>

                              {apt.notes && (
                                <p className="mt-1 text-[11px] italic text-slate-500 line-clamp-1">
                                  Note: {apt.notes}
                                </p>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {apt.status === 'BOOKED' || apt.status === 'CONFIRMED' ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleCheckIn(apt)}
                                  className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  Mark Arrived
                                </Button>
                              ) : null}

                              {apt.status === 'ARRIVED' ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleQueueTransition(apt.id, 'IN_SERVICE')}
                                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                  Start Service
                                </Button>
                              ) : null}

                              {apt.status === 'IN_PROGRESS' ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleQueueTransition(apt.id, 'COMPLETED')}
                                  className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  Complete Service
                                </Button>
                              ) : null}

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedApt(apt);
                                  setIsDetailModalOpen(true);
                                }}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedApt(apt);
                                  setIsRescheduleModalOpen(true);
                                }}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                                title="Reschedule"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedApt(apt);
                                  setIsCancelModalOpen(true);
                                }}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                                title="Cancel"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STAFF VIEW COLUMNS */}
          {viewMode === 'staff' && (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {staffList.map((staff) => {
                const staffApts = filteredAppointments.filter((a) => a.staffId === staff.id);

                return (
                  <div
                    key={staff.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50"
                  >
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-[11px]">
                        {staff.avatar}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                          {staff.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">{staff.chair}</span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      {staffApts.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-[11px] text-slate-400">
                          Chair Available
                        </div>
                      ) : (
                        staffApts.map((apt) => (
                          <div
                            key={apt.id}
                            className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                          >
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                                {apt.customerName}
                              </span>
                              {renderStatusBadge(apt.status)}
                            </div>
                            <p className="mt-1 text-[10px] text-slate-500 truncate">
                              {apt.serviceName}
                            </p>
                            <div className="mt-1.5 flex items-center justify-between text-[10px] font-medium text-slate-400 border-t border-slate-100 pt-1 dark:border-slate-700">
                              <span>{new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <span className="font-bold text-emerald-600">₹{apt.totalAmount}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* WEEK / MONTH / BRANCH VIEWS */}
          {(viewMode === 'week' || viewMode === 'month' || viewMode === 'branch') && (
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
              <CalendarIcon className="mx-auto h-10 w-10 text-amber-600 mb-2" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {viewMode === 'week' ? '7-Day Weekly Matrix View' : viewMode === 'month' ? '30-Day Monthly Schedule Overview' : 'Multi-Branch Comparison View'}
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                Displaying aggregated distribution across {filteredAppointments.length} bookings for {branchesList.find((b) => b.id === selectedBranchId)?.name || 'All Branches'}.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {branchesList.map((b) => (
                  <div key={b.id} className="rounded-lg bg-white p-3 shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-left">
                    <span className="text-xs font-bold">{b.name}</span>
                    <span className="block text-[10px] text-slate-400">{b.city}</span>
                    <div className="mt-1 text-base font-extrabold text-amber-600">
                      {appointments.filter((a) => a.branchId === b.id).length} Bookings
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 6. LIVE WALK-IN QUEUE BOARD (4-STAGE KANBAN) */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Live Walk-in & Check-in Queue Manager
              </h2>
              <p className="text-xs text-slate-500">
                Real-time queue ticket progression with waiting time countdowns and chair dispatch.
              </p>
            </div>

            <Button
              onClick={() => setIsWalkInModalOpen(true)}
              className="h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Issue Walk-in Token
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* COLUMN 1: WAITING */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 dark:border-blue-950 dark:bg-blue-950/20">
              <div className="flex items-center justify-between border-b border-blue-200 pb-2 dark:border-blue-900">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                  1. Waiting in Lounge ({queueTickets.filter((t) => t.queueStatus === 'WAITING').length})
                </span>
                <Clock className="h-4 w-4 text-blue-600" />
              </div>

              <div className="mt-3 space-y-3">
                {queueTickets.filter((t) => t.queueStatus === 'WAITING').map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-xl border border-blue-100 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="warning" className="font-mono font-bold">
                        {ticket.queueToken || 'W-01'}
                      </Badge>
                      <span className="text-[10px] text-slate-400">
                        Wait: ~15 mins
                      </span>
                    </div>

                    <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                      {ticket.customerName}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {ticket.serviceName}
                    </p>
                    <span className="block text-[10px] text-slate-400 mt-1">
                      Stylist: <strong>{ticket.staffName}</strong>
                    </span>

                    <div className="mt-3 flex items-center justify-end">
                      <Button
                        size="sm"
                        onClick={() => handleQueueTransition(ticket.id, 'CALLED')}
                        className="h-7 text-[11px] bg-blue-600 hover:bg-blue-700 text-white w-full"
                      >
                        Call Next Guest 📢
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: CALLED */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 dark:border-amber-950 dark:bg-amber-950/20">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2 dark:border-amber-900">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  2. Called / Ready ({queueTickets.filter((t) => t.queueStatus === 'CALLED').length})
                </span>
                <Bell className="h-4 w-4 text-amber-600" />
              </div>

              <div className="mt-3 space-y-3">
                {queueTickets.filter((t) => t.queueStatus === 'CALLED').map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-xl border border-amber-100 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <Badge variant="warning" className="font-mono font-bold">
                      {ticket.queueToken}
                    </Badge>
                    <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                      {ticket.customerName}
                    </h4>
                    <p className="text-[11px] text-slate-500">{ticket.serviceName}</p>
                    <div className="mt-3 flex items-center justify-end">
                      <Button
                        size="sm"
                        onClick={() => handleQueueTransition(ticket.id, 'IN_SERVICE')}
                        className="h-7 text-[11px] bg-purple-600 hover:bg-purple-700 text-white w-full"
                      >
                        Seat & Start Service ✂️
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 3: IN SERVICE */}
            <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4 dark:border-purple-950 dark:bg-purple-950/20">
              <div className="flex items-center justify-between border-b border-purple-200 pb-2 dark:border-purple-900">
                <span className="text-xs font-bold text-purple-900 dark:text-purple-300">
                  3. In Service ({queueTickets.filter((t) => t.queueStatus === 'IN_SERVICE').length})
                </span>
                <Scissors className="h-4 w-4 text-purple-600" />
              </div>

              <div className="mt-3 space-y-3">
                {queueTickets.filter((t) => t.queueStatus === 'IN_SERVICE').map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-xl border border-purple-100 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="warning">{ticket.queueToken}</Badge>
                      <span className="text-[10px] text-purple-600 font-bold">In Chair</span>
                    </div>
                    <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                      {ticket.customerName}
                    </h4>
                    <p className="text-[11px] text-slate-500">{ticket.serviceName}</p>
                    <div className="mt-3 flex items-center justify-end">
                      <Button
                        size="sm"
                        onClick={() => handleQueueTransition(ticket.id, 'COMPLETED')}
                        className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white w-full"
                      >
                        Complete Service ✅
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 4: COMPLETED */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-950 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2 dark:border-emerald-900">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  4. Completed / Ready for POS ({queueTickets.filter((t) => t.queueStatus === 'COMPLETED').length})
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>

              <div className="mt-3 space-y-3">
                {queueTickets.filter((t) => t.queueStatus === 'COMPLETED').map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-xl border border-emerald-100 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <Badge variant="success">FINISHED</Badge>
                    <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                      {ticket.customerName}
                    </h4>
                    <p className="text-[11px] text-slate-500">{ticket.serviceName}</p>
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success('Sent to POS', `Opening POS billing for ${ticket.customerName}...`)}
                        className="h-7 text-[11px] w-full"
                      >
                        Generate Invoice & Bill 💳
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. 5-STEP APPOINTMENT BOOKING MODAL */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-amber-100 p-1.5 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              <CalendarIcon className="h-5 w-5" />
            </span>
            <span>Book Client Appointment</span>
          </div>
        }
        description={`Step ${bookStep} of 5 — ${
          bookStep === 1
            ? 'Customer Information & Phone Lookup'
            : bookStep === 2
            ? 'Branch & Service Selection'
            : bookStep === 3
            ? 'Staff Assignment & Preferred Stylist'
            : bookStep === 4
            ? 'Date, Time & Double Booking Protection'
            : 'Notes, Preferences & Reminder Triggers'
        }`}
        maxWidth="lg"
      >
        <div className="space-y-6">
          {/* Step Progress Indicator */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    bookStep === s
                      ? 'bg-amber-600 text-white shadow'
                      : bookStep > s
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                  }`}
                >
                  {bookStep > s ? <Check className="h-3.5 w-3.5" /> : s}
                </div>
                <span className={`text-[11px] font-medium hidden sm:inline ${bookStep === s ? 'font-bold text-amber-700' : 'text-slate-400'}`}>
                  {s === 1 ? 'Client' : s === 2 ? 'Services' : s === 3 ? 'Staff' : s === 4 ? 'Time Slot' : 'Confirm'}
                </span>
                {s < 5 && <ChevronRight className="h-3 w-3 text-slate-300" />}
              </div>
            ))}
          </div>

          {/* STEP 1: Customer */}
          {bookStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Client Full Name *
                </label>
                <Input
                  placeholder="e.g. Priya Sharma"
                  value={bookCustomerName}
                  onChange={(e) => setBookCustomerName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  10-Digit Mobile Number *
                </label>
                <Input
                  placeholder="e.g. +91 98765 43210"
                  value={bookCustomerPhone}
                  onChange={(e) => setBookCustomerPhone(e.target.value)}
                  className="mt-1"
                />
                <span className="text-[10px] text-slate-400">
                  Used for automated 24h & 2h WhatsApp reminders and booking confirmation.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Services */}
          {bookStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Branch
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  value={bookBranchId}
                  onChange={(e) => setBookBranchId(e.target.value)}
                >
                  {branchesList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Select Services (Supports Multiple Chained Services)
                </label>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {servicesList.map((srv) => {
                    const isSelected = bookServiceIds.includes(srv.id);
                    return (
                      <div
                        key={srv.id}
                        onClick={() => {
                          if (isSelected) {
                            if (bookServiceIds.length > 1) {
                              setBookServiceIds(bookServiceIds.filter((id) => id !== srv.id));
                            }
                          } else {
                            setBookServiceIds([...bookServiceIds, srv.id]);
                          }
                        }}
                        className={`flex items-center justify-between rounded-lg p-2.5 border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
                            : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {srv.name}
                            </span>
                            <span className="block text-[10px] text-slate-400">
                              {srv.category} • {srv.duration} mins
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">
                          ₹{srv.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Staff */}
          {bookStep === 3 && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Assign Certified Stylist / Therapist *
              </label>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 max-h-60 overflow-y-auto">
                {staffList.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setBookStaffId(st.id)}
                    className={`flex items-center gap-3 rounded-xl p-3 border cursor-pointer transition-all ${
                      bookStaffId === st.id
                        ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-xs shrink-0">
                      {st.avatar}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {st.name}
                      </span>
                      <span className="block text-[10px] text-slate-400">{st.role} • {st.chair}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Date, Time & Collision Detection */}
          {bookStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Appointment Date *
                  </label>
                  <Input
                    type="date"
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Start Time *
                  </label>
                  <Input
                    type="time"
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    className="mt-1 font-bold"
                  />
                </div>
              </div>

              {/* Real-time Collision Check Indicator */}
              {(() => {
                const startIso = `${bookDate}T${bookTime}:00.000Z`;
                const conflict = checkCollisionClient(bookStaffId, startIso, 60, 15);

                return conflict ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 dark:border-red-900 dark:bg-red-950/30">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-red-900 dark:text-red-300">
                          Double Booking Collision Alert!
                        </span>
                        <p className="text-[11px] text-red-700 dark:text-red-400 mt-0.5">
                          {conflict.staffName} already has booking <strong>{conflict.appointmentNumber}</strong> with {conflict.customerName} overlapping this slot. Please choose another time or stylist.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 dark:border-emerald-900 dark:bg-emerald-950/30">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-bold">
                        Slot Verified — Zero Schedule Conflicts
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* STEP 5: Confirm & Notes */}
          {bookStep === 5 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Appointment Notes & Chemical Formulas
                </label>
                <textarea
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  placeholder="Special requests, patch test notes, beverage preference..."
                  value={bookNotes}
                  onChange={(e) => setBookNotes(e.target.value)}
                />
              </div>

              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Automated Reminder Triggers
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rem24"
                    checked={bookReminders.h24}
                    onChange={(e) => setBookReminders({ ...bookReminders, h24: e.target.checked })}
                    className="h-4 w-4 rounded text-amber-600"
                  />
                  <label htmlFor="rem24" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    Send 24-hour reminder via WhatsApp & SMS
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rem2"
                    checked={bookReminders.h2}
                    onChange={(e) => setBookReminders({ ...bookReminders, h2: e.target.checked })}
                    className="h-4 w-4 rounded text-amber-600"
                  />
                  <label htmlFor="rem2" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    Send 2-hour reminder with GPS directions
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
            <div>
              {bookStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setBookStep(bookStep - 1)}
                  className="flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setIsBookModalOpen(false)}>
                Cancel
              </Button>
              {bookStep < 5 ? (
                <Button
                  onClick={() => {
                    if (bookStep === 1 && (!bookCustomerName.trim() || !bookCustomerPhone.trim())) {
                      toast.error('Client info required', 'Please provide name and phone.');
                      return;
                    }
                    setBookStep(bookStep + 1);
                  }}
                  className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSaveBooking}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Confirm & Schedule Booking
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* 8. FAST WALK-IN MODAL */}
      <Modal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        title="Walk-in Guest Rapid Intake"
        description="Issue token and assign to live waiting queue."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Guest Name *
            </label>
            <Input
              placeholder="e.g. Kavita Reddy"
              value={walkInName}
              onChange={(e) => setWalkInName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              10-Digit Contact Mobile *
            </label>
            <Input
              placeholder="e.g. +91 97000 11223"
              value={walkInPhone}
              onChange={(e) => setWalkInPhone(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Requested Service *
            </label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              value={walkInServiceId}
              onChange={(e) => setWalkInServiceId(e.target.value)}
            >
              {servicesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (₹{s.price} • {s.duration}m)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setIsWalkInModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveWalkIn}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Generate Token & Add to Queue
            </Button>
          </div>
        </div>
      </Modal>

      {/* 9. APPOINTMENT DETAIL MODAL */}
      {selectedApt && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-amber-600" />
              <span>{selectedApt.appointmentNumber}</span>
            </div>
          }
          description={`Customer: ${selectedApt.customerName} • Phone: ${selectedApt.customerPhone}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {selectedApt.serviceName}
                </span>
                {renderStatusBadge(selectedApt.status)}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Stylist: <strong>{selectedApt.staffName}</strong> • {selectedApt.chairNumber}
              </p>
              <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-200 pt-2 dark:border-slate-700">
                <span>Start: {new Date(selectedApt.startTime).toLocaleString()}</span>
                <span className="font-bold text-emerald-600">₹{selectedApt.totalAmount}</span>
              </div>
            </div>

            {selectedApt.notes && (
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <strong>Internal Notes: </strong> {selectedApt.notes}
              </div>
            )}

            <div className="flex justify-end border-t border-slate-200 pt-3 dark:border-slate-800">
              <Button onClick={() => setIsDetailModalOpen(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 10. RESCHEDULE MODAL */}
      {selectedApt && (
        <Modal
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          title={`Reschedule ${selectedApt.appointmentNumber}`}
          description={`Client: ${selectedApt.customerName}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  New Date
                </label>
                <Input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  New Start Time
                </label>
                <Input
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
              <Button variant="ghost" onClick={() => setIsRescheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveReschedule} className="bg-amber-600 hover:bg-amber-700 text-white">
                Reschedule Slot
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 11. CANCEL MODAL */}
      {selectedApt && (
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          title={`Cancel Appointment ${selectedApt.appointmentNumber}`}
          description="Are you sure you want to cancel this booking?"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Cancellation Reason
              </label>
              <Input
                placeholder="e.g. Client requested postponement"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
              <Button variant="ghost" onClick={() => setIsCancelModalOpen(false)}>
                Keep Appointment
              </Button>
              <Button onClick={handleSaveCancel} className="bg-red-600 hover:bg-red-700 text-white">
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
