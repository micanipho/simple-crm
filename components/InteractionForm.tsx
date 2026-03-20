'use client';

import React, { useState, useEffect } from 'react';
import { Interaction } from '@/types';
import Spinner from './Spinner';

interface InteractionFormProps {
  customerId: string;
  interaction?: Interaction;
  onSubmit: (interactionData: Omit<Interaction, 'id' | 'createdAt' | 'updatedAt' | 'customerId'>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const InteractionForm: React.FC<InteractionFormProps> = ({
  customerId,
  interaction,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<
    Omit<Interaction, 'id' | 'createdAt' | 'updatedAt' | 'customerId'>
  >({
    type: 'Note',
    notes: '',
    interactionDate: new Date().toISOString().substring(0, 16), // YYYY-MM-DDTHH:MM
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (interaction) {
      setFormData({
        type: interaction.type || 'Note',
        notes: interaction.notes,
        interactionDate: interaction.interactionDate
          ? new Date(interaction.interactionDate).toISOString().substring(0, 16)
          : new Date().toISOString().substring(0, 16),
      });
    }
  }, [interaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.notes.trim()) newErrors.notes = 'Notes are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit({
        ...formData,
        interactionDate: formData.interactionDate ? new Date(formData.interactionDate).toISOString() : undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Interaction Type
        </label>
        <select
          name="type"
          id="type"
          value={formData.type || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        >
          <option value="Note">Note</option>
          <option value="Call">Call</option>
          <option value="Email">Email</option>
          <option value="Meeting">Meeting</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes <span className="text-error">*</span>
        </label>
        <textarea
          name="notes"
          id="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
            errors.notes ? 'border-error' : ''
          }`}
          required
        ></textarea>
        {errors.notes && <p className="mt-1 text-sm text-error">{errors.notes}</p>}
      </div>
      <div>
        <label htmlFor="interactionDate" className="block text-sm font-medium text-gray-700">
          Interaction Date
        </label>
        <input
          type="datetime-local"
          name="interactionDate"
          id="interactionDate"
          value={formData.interactionDate || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : interaction ? 'Update Interaction' : 'Add Interaction'}
        </button>
      </div>
    </form>
  );
};

export default InteractionForm;