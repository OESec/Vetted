import React from 'react';
import { FileText, SlidersHorizontal } from 'lucide-react';

interface UploadTypeChooserProps {
  onSelectTemplate: () => void;
  onSelectCustom: () => void;
}

const UploadTypeChooser: React.FC<UploadTypeChooserProps> = ({ onSelectTemplate, onSelectCustom }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <FileText size={24} />
          </div>
          <h2 className="text-2xl font-bold text-neutralDark">New Security Audit</h2>
          <p className="text-gray-500 mt-2">How would you like to upload your questionnaire?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Option 1: Use Template */}
          <button
            onClick={onSelectTemplate}
            className="p-6 border border-gray-200 rounded-lg text-left hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center mb-2">
              <FileText size={20} className="text-primary mr-3" />
              <h3 className="font-bold text-lg text-neutralDark">Use a Template</h3>
            </div>
            <p className="text-sm text-gray-500">
              Upload a CSV file that follows our standard template. This is the fastest and most reliable method.
            </p>
          </button>

          {/* Option 2: Custom File */}
          <button
            onClick={onSelectCustom}
            className="p-6 border border-gray-200 rounded-lg text-left hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center mb-2">
              <SlidersHorizontal size={20} className="text-primary mr-3" />
              <h3 className="font-bold text-lg text-neutralDark">Upload Custom File</h3>
            </div>
            <p className="text-sm text-gray-500">
              Upload a file with different column names and map them to the required fields.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadTypeChooser;
