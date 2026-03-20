import React from 'react';
import Link from 'next/link';
import { Customer } from '@/types';

interface CustomerCardProps {
  customer: Customer;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
  return (
    <Link
      href={`/customers/${customer.id}`}
      className="block bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-text">
            {customer.firstName} {customer.lastName}
          </h3>
          <p className="text-sm text-gray-600">{customer.email}</p>
          {customer.phone && <p className="text-sm text-gray-600">{customer.phone}</p>}
        </div>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
          View Details
        </span>
      </div>
    </Link>
  );
};

export default CustomerCard;