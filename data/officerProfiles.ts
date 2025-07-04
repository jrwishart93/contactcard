import { OfficerProfileProps } from '@/components/OfficerProfile';

export const officerProfiles: (OfficerProfileProps & { id: string })[] = [
  {
    id: 'john-smith',
    name: 'PC John Smith',
    badgeNumber: '1232342',
    collarNumber: 'T123',
    unit: 'Road Policing Unit',
    email: 'folk_dragnet.2a@icloud.com',
    phone: '101',
    profileImage: '/images/trafficofficercontact.png',
  },
  {
    id: 'jane-doe',
    name: 'PC Jane Doe',
    badgeNumber: '2345432',
    collarNumber: 'T345',
    unit: 'Road Policing Unit',
    email: 'jane.doe@scotland.police.uk',
    phone: '2345432',
    profileImage: '/images/trafficofficercontact.png',
  },
];
