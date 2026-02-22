export interface Place {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'urgent-care' | 'pharmacy';
  typeLabel: string;
  address: string;
  phone: string;
  hours?: string;
  lat: number;
  lng: number;
  openNow: boolean;
  statusLabel: string;
  statusColor: 'green' | 'orange' | 'red';
  waitMins?: number;
  closesLabel?: string;
}

export const places: Place[] = [
  {
    id: 'gr-baker',
    name: 'G.R. Baker Memorial',
    type: 'hospital',
    typeLabel: 'Emergency Room • 24/7',
    address: '543 Front Street, Quesnel, BC V2J 2K7',
    phone: '(250) 985-5600',
    lat: 52.9784,
    lng: -122.4931,
    openNow: true,
    statusLabel: 'Open Now',
    statusColor: 'green',
    waitMins: 25,
  },
  {
    id: 'primary-care',
    name: 'Quesnel Primary Care',
    type: 'clinic',
    typeLabel: 'Walk-in Clinic',
    address: '644 Front Street, Quesnel, BC V2J 2K8',
    phone: '(250) 992-8322',
    lat: 52.9793,
    lng: -122.4920,
    openNow: false,
    statusLabel: 'Closes 5pm',
    statusColor: 'orange',
    closesLabel: 'Closes 5pm',
  },
  {
    id: 'upcc',
    name: 'Quesnel UPCC',
    type: 'urgent-care',
    typeLabel: 'Urgent & Primary Care',
    address: 'Quesnel, BC (call to book)',
    phone: '(250) 991-7571',
    hours: 'Mon–Fri 12pm–8pm; Weekends/Holidays 10am–2pm',
    lat: 52.9810,
    lng: -122.4950,
    openNow: true,
    statusLabel: 'Open Now',
    statusColor: 'green',
    waitMins: 25,
  },
  {
    id: 'shoppers',
    name: 'Shoppers Drug Mart',
    type: 'pharmacy',
    typeLabel: 'Pharmacy',
    address: '225 St. Laurent Ave, Quesnel, BC V2J 2C8',
    phone: '(250) 992-2214',
    lat: 52.9770,
    lng: -122.4870,
    openNow: true,
    statusLabel: 'Open',
    statusColor: 'green',
  },
];

export const QUESNEL_CENTER = { lat: 52.9784, lng: -122.4931 };

export function getDirectionsUrl(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function getPhoneUrl(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}
