// components/ExternalServicesSection.tsx
import React from "react";
import { DollarSign } from "lucide-react";

interface ExternalServicesSectionProps {
  domainCost: string;
  setDomainCost: (value: string) => void;
  serverCost: string;
  setServerCost: (value: string) => void;
  handlePositiveInput: (
    setter: (val: string) => void
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ExternalServicesSection: React.FC<
  ExternalServicesSectionProps
> = ({
  domainCost,
  setDomainCost,
  serverCost,
  setServerCost,
  handlePositiveInput,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>الخدمات الخارجية</span>
        <DollarSign className="w-6 h-6 text-cyan-600" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="domainCost"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            تكلفة الدومين (جنيه)
          </label>
          <input
            id="domainCost"
            type="number"
            min="0"
            value={domainCost}
            onChange={handlePositiveInput(setDomainCost)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
            placeholder="500"
            title="تكلفة شراء الدومين"
          />
        </div>
        <div>
          <label
            htmlFor="serverCost"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            تكلفة السيرفر (جنيه)
          </label>
          <input
            id="serverCost"
            type="number"
            min="0"
            value={serverCost}
            onChange={handlePositiveInput(setServerCost)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
            placeholder="2000"
            title="تكلفة استضافة السيرفر السنوية/الشهرية"
          />
        </div>
      </div>
      <div className="mt-4 bg-cyan-50 border-2 border-cyan-300 rounded-lg p-4">
        <p className="font-bold text-cyan-900">
          إجمالي الخدمات الخارجية:{" "}
          <span className="text-2xl">
            {(
              (parseFloat(domainCost) || 0) + (parseFloat(serverCost) || 0)
            ).toFixed(2)}{" "}
            ج
          </span>
        </p>
      </div>
    </div>
  );
};
