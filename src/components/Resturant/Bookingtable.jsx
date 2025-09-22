import { useState } from 'react';
import BookTable from './Booktable';
import AvailableTable from './Availabletable';
import AllBookings from './Allbookings';

const BookingTable = () => {
  const [activeTab, setActiveTab] = useState('available');

  const tabs = [
    { id: 'available', label: 'Available Tables', component: AvailableTable },
    { id: 'all', label: 'All Bookings', component: AllBookings }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {ActiveComponent && <ActiveComponent />}
    </div>
  );
};

export default BookingTable;