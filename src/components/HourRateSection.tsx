// components/HourRateSection.tsx
import React from "react";
import { DollarSign } from "lucide-react";

interface HourRateSectionProps {
  salary: string;
  setSalary: (value: string) => void;
  hoursPerDay: string;
  setHoursPerDay: (value: string) => void;
  calculationFactor: string;
  setCalculationFactor: (value: string) => void;
  hourRate: number;
  handlePositiveInput: (
    setter: (val: string) => void
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const HourRateSection: React.FC<HourRateSectionProps> = ({
  salary,
  setSalary,
  hoursPerDay,
  setHoursPerDay,
  calculationFactor,
  setCalculationFactor,
  hourRate,
  handlePositiveInput,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>1. تحديد سعر الساعة</span>
        <DollarSign className="w-6 h-6 text-green-600" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="salaryInput"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            الراتب (جنيه)
          </label>
          <input
            id="salaryInput"
            type="number"
            min="0"
            title="الراتب الشهري"
            value={salary}
            onChange={handlePositiveInput(setSalary)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="10000"
          />
        </div>
        <div>
          <label
            htmlFor="hoursPerDayInput"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            عدد الساعات (يومياً)
          </label>
          <input
            id="hoursPerDayInput"
            type="number"
            min="0"
            title="عدد الساعات اليومية للعمل"
            value={hoursPerDay}
            onChange={handlePositiveInput(setHoursPerDay)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="8"
          />
        </div>
        <div>
          <label
            htmlFor="factorInput"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            عامل الحسبة
          </label>
          <input
            id="factorInput"
            type="number"
            min="0"
            step="0.1"
            title="عامل الحسبة (لزيادة التكلفة عن سعر الساعة الأساسي)"
            value={calculationFactor}
            onChange={handlePositiveInput(setCalculationFactor)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="1.5"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            سعر الساعة
          </label>
          <div className="w-full px-4 py-2 bg-green-50 border-2 border-green-300 rounded-lg text-green-700 font-bold text-lg">
            {hourRate} ج
          </div>
        </div>
      </div>
    </div>
  );
};
