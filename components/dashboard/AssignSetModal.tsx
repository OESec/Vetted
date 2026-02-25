import React, { useState, useEffect } from 'react';
import { ReviewSet } from '../../types';
import Button from '../Button';
import { X, Plus } from 'lucide-react';

interface AssignSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewSets: ReviewSet[];
  currentSetId: string | null;
  onAssign: (newSetId: string | null) => void;
  onCreateAndAssign: (setName: string, setDescription: string) => void;
}

const AssignSetModal: React.FC<AssignSetModalProps> = ({ 
    isOpen, 
    onClose, 
    reviewSets, 
    currentSetId, 
    onAssign, 
    onCreateAndAssign 
}) => {
  const [selectedSetId, setSelectedSetId] = useState<string | null>(currentSetId);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetDescription, setNewSetDescription] = useState('');

  useEffect(() => {
    // Reset state when the modal is opened or the current set changes
    setSelectedSetId(currentSetId);
    setIsCreatingNew(false);
    setNewSetName('');
    setNewSetDescription('');
  }, [isOpen, currentSetId]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (isCreatingNew) {
        if (newSetName.trim()) {
            onCreateAndAssign(newSetName.trim(), newSetDescription.trim());
        }
    } else {
        onAssign(selectedSetId);
    }
    onClose();
  };

  const availableSets = reviewSets.filter(s => s.status === 'Open');

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in-up">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg m-4">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-neutralDark dark:text-white">Assign to Review Set</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!isCreatingNew ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="review-set-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select an existing set</label>
                <select
                  id="review-set-select"
                  value={selectedSetId || 'unassigned'}
                  onChange={(e) => setSelectedSetId(e.target.value === 'unassigned' ? null : e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  <option value="unassigned">None (Unassigned)</option>
                  {availableSets.map(set => (
                    <option key={set.id} value={set.id}>{set.name}</option>
                  ))}
                </select>
              </div>
              <div className="text-center">
                 <button onClick={() => setIsCreatingNew(true)} className="inline-flex items-center text-sm text-primary hover:underline">
                    <Plus size={14} className="mr-1"/> Create New Review Set
                 </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-600">
              <h3 className="font-bold text-neutralDark dark:text-white">Create New Set</h3>
              <div>
                <label htmlFor="new-set-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Set Name <span className="text-red-500">*</span></label>
                <input 
                    type="text"
                    id="new-set-name"
                    value={newSetName}
                    onChange={(e) => setNewSetName(e.target.value)}
                    placeholder="e.g., Q4 Cloud Services RFP"
                    className="block w-full text-base border-gray-300 dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                />
              </div>
               <div>
                <label htmlFor="new-set-desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                <textarea 
                    id="new-set-desc"
                    value={newSetDescription}
                    onChange={(e) => setNewSetDescription(e.target.value)}
                    rows={2}
                    placeholder="A brief description of this review set's purpose."
                    className="block w-full text-base border-gray-300 dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                />
              </div>
              <button onClick={() => setIsCreatingNew(false)} className="text-sm text-gray-500 hover:underline">
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button 
                variant="primary" 
                onClick={handleSave}
                disabled={isCreatingNew && !newSetName.trim()}
            >
                {isCreatingNew ? 'Create & Assign' : 'Save Assignment'}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignSetModal;
