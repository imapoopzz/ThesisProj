export const mockUser = {
  id: '1',
  firstName: 'Juan',
  middleInitial: 'D',
  lastName: 'Dela Cruz',
  email: 'juan.delacruz@bdo.com.ph',
  phone: '+63 917 123 4567',
  company: 'BDO Unibank Inc.',
  position: 'Senior Bank Officer',
  unionPosition: 'Member',
  membershipDate: '2024-01-15',
  digitalId: 'ALU-BDO-2024-001234',
  qrCode: 'ALU001234',
  address: '123 Rizal Street, Makati City, Metro Manila',
  emergencyContact: {
    name: 'Maria Dela Cruz',
    relationship: 'Spouse',
    phone: '+63 917 555 1122',
  },
};

export const mockDues = [
  {
    billingPeriod: 'March 2025',
    amount: 350,
    status: 'pending',
    dueDate: 'March 15, 2025',
  },
  {
    billingPeriod: 'February 2025',
    amount: 350,
    status: 'paid',
    paidAt: 'February 10, 2025',
    reference: 'OR-2025-0210',
  },
  {
    billingPeriod: 'January 2025',
    amount: 350,
    status: 'paid',
    paidAt: 'January 12, 2025',
    reference: 'OR-2025-0112',
  },
  {
    billingPeriod: 'December 2024',
    amount: 350,
    status: 'paid',
    paidAt: 'December 11, 2024',
    reference: 'OR-2024-1211',
  },
];

export const mockNotifications = [
  {
    id: 'notif-1',
    title: 'Regional Council Meeting',
    message: 'Join the quarterly policy review on March 18 at 2:00 PM via Zoom.',
    timestamp: 'March 10, 2025',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: 'Dues Reminder',
    message: 'Your March membership dues are due on March 15, 2025.',
    timestamp: 'March 1, 2025',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'Training Confirmation',
    message: 'You are confirmed for the Workplace Safety workshop on April 5.',
    timestamp: 'February 28, 2025',
    isRead: true,
  },
];

export const mockNews = [
  {
    id: 'news-1',
    title: 'ALU secures improved healthcare package for banking sector members',
    summary: 'A new collective bargaining milestone provides expanded coverage and lower co-pay for members.',
    category: 'Union Update',
    date: 'March 8, 2025',
    link: '#',
  },
  {
    id: 'news-2',
    title: 'Skills acceleration program launches in partnership with TESDA',
    summary: 'Members can now enroll in subsidized upskilling programs focused on digital literacy and logistics.',
    category: 'Learning',
    date: 'March 5, 2025',
    link: '#',
  },
  {
    id: 'news-3',
    title: 'ALU celebrates 70 years of service with nationwide caravan',
    summary: 'A month-long caravan will visit 12 provinces offering free consultations and benefits assistance.',
    category: 'Events',
    date: 'February 28, 2025',
    link: '#',
  },
];
