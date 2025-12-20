// components/SummarySection.tsx
import React from "react";
import { FileText } from "lucide-react";
import type { Totals } from "../types";

interface SummarySectionProps {
  totals: Totals;
  summaryRows: string[];
  hoursPerDay: string;
  totalProjectHours: number;
  totalProjectPoints: number;
  totalProjectDays: number;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  totals,
  summaryRows,
  hoursPerDay,
  totalProjectHours,
  totalProjectPoints,
  totalProjectDays,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>7. ملخص الساعات والنقاط</span>
        <FileText className="w-6 h-6 text-indigo-600" />
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {summaryRows.includes("ui") && (
          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 text-center">
            <p className="text-sm text-purple-700 font-semibold mb-1">UI/UX</p>
            <p className="text-xl font-bold text-purple-900">
              {totals.totalUI} ساعة
            </p>
            <p className="text-sm text-purple-700 font-bold mt-1">
              {totals.pointsUI} Points
            </p>
            <p className="text-sm font-bold text-purple-800 mt-2">
              {hoursPerDay
                ? Math.ceil(totals.totalUI / parseFloat(hoursPerDay))
                : "0"}{" "}
              يوم
            </p>
          </div>
        )}

        {summaryRows.includes("frontend") && (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-700 font-semibold mb-1">Frontend</p>
            <p className="text-xl font-bold text-blue-900">
              {totals.totalFrontend} ساعة
            </p>
            <p className="text-sm text-blue-700 font-bold mt-1">
              {totals.pointsFrontend} Points
            </p>
            <p className="text-sm font-bold text-blue-800 mt-2">
              {hoursPerDay
                ? Math.ceil(totals.totalFrontend / parseFloat(hoursPerDay))
                : "0"}{" "}
              يوم
            </p>
          </div>
        )}

        {summaryRows.includes("backend") && (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
            <p className="text-sm text-green-700 font-semibold mb-1">Backend</p>
            <p className="text-xl font-bold text-green-900">
              {totals.totalBackend} ساعة
            </p>
            <p className="text-sm text-green-700 font-bold mt-1">
              {totals.pointsBackend} Points
            </p>
            <p className="text-sm font-bold text-green-800 mt-2">
              {hoursPerDay
                ? Math.ceil(totals.totalBackend / parseFloat(hoursPerDay))
                : "0"}{" "}
              يوم
            </p>
          </div>
        )}

        {summaryRows.includes("analysis") && (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 text-center">
            <p className="text-sm text-orange-700 font-semibold mb-1">
              Analysis
            </p>
            <p className="text-xl font-bold text-orange-900">
              {totals.totalAnalysis} ساعة
            </p>
            <p className="text-xs text-orange-600 mt-1">-</p>
            <p className="text-sm font-bold text-orange-800 mt-2">
              {hoursPerDay
                ? Math.ceil(totals.totalAnalysis / parseFloat(hoursPerDay))
                : "0"}{" "}
              يوم
            </p>
          </div>
        )}

        {summaryRows.includes("testing") && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center">
            <p className="text-sm text-red-700 font-semibold mb-1">Testing</p>
            <p className="text-xl font-bold text-red-900">
              {totals.totalTesting} ساعة
            </p>
            <p className="text-xs text-red-600 mt-1">-</p>
            <p className="text-sm font-bold text-red-800 mt-2">
              {hoursPerDay
                ? Math.ceil(totals.totalTesting / parseFloat(hoursPerDay))
                : "0"}{" "}
              يوم
            </p>
          </div>
        )}
      </div>

      {/* Total Project Summary */}
      <div className="mt-6 bg-indigo-100 border-2 border-indigo-500 rounded-lg p-4 text-center grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-2">
          <p className="text-lg text-indigo-700 font-semibold mb-1">
            إجمالي عدد الساعات
          </p>
          <p className="text-3xl font-bold text-indigo-900">
            {totalProjectHours.toFixed(2)}
          </p>
        </div>
        <div className="p-2 border-y md:border-y-0 md:border-x border-indigo-200">
          <p className="text-lg text-indigo-700 font-semibold mb-1">
            إجمالي عدد النقاط
          </p>
          <p className="text-3xl font-bold text-indigo-900">
            {totalProjectPoints}
          </p>
        </div>
        <div className="p-2">
          <p className="text-lg text-indigo-700 font-semibold mb-1">
            إجمالي عدد الأيام
          </p>
          <p className="text-3xl font-bold text-indigo-900">
            {totalProjectDays}
          </p>
        </div>
      </div>
    </div>
  );
};
