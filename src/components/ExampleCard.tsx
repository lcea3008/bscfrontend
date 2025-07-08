import React from 'react';

interface ExampleCardProps {
  title: string;
  description: string;
  icon?: string;
}

const ExampleCard: React.FC<ExampleCardProps> = ({ title, description, icon = "🚀" }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">{icon}</span>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      <div className="mt-4 flex space-x-2">
        <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
          Acción Principal
        </button>
        <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
          Secundaria
        </button>
      </div>
    </div>
  );
};

export default ExampleCard;
