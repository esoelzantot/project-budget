// components/AnalysisTestingSection.tsx
import React from "react";
import { Clock } from "lucide-react";

interface AnalysisTestingSectionProps {
  analysisHours: string;
  setAnalysisHours: (value: string) => void;
  testingHours: string;
  setTestingHours: (value: string) => void;
  hourRate: number;
  handlePositiveInput: (
    setter: (val: string) => void
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AnalysisTestingSection: React.FC<AnalysisTestingSectionProps> = ({
  analysisHours,
  setAnalysisHours,
  testingHours,
  setTestingHours,
  hourRate,
  handlePositiveInput,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>6. Analysis & Testing</span>
        <Clock className="w-6 h-6 text-orange-600" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="analysisHours"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            ساعات Analysis
          </label>
          <input
            id="analysisHours"
            type="number"
            min="0"
            value={analysisHours}
            onChange={handlePositiveInput(setAnalysisHours)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            title="عدد ساعات التحليل"
          />
          <div className="mt-2 bg-orange-50 border-2 border-orange-300 rounded-lg p-3">
            <p className="font-bold text-orange-900">
              تكلفة Analysis:{" "}
              <span className="text-lg">
                {((parseFloat(analysisHours) || 0) * hourRate).toFixed(2)} ج
              </span>
            </p>
          </div>
        </div>
        <div>
          <label
            htmlFor="testingHours"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            ساعات Testing
          </label>
          <input
            id="testingHours"
            type="number"
            min="0"
            value={testingHours}
            onChange={handlePositiveInput(setTestingHours)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            title="عدد ساعات الاختبار"
          />
          <div className="mt-2 bg-red-50 border-2 border-red-300 rounded-lg p-3">
            <p className="font-bold text-red-900">
              تكلفة Testing:{" "}
              <span className="text-lg">
                {((parseFloat(testingHours) || 0) * hourRate).toFixed(2)} ج
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
