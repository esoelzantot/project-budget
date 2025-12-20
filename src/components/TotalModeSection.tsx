// components/TotalModeSection.tsx
import React from "react";
import { Layers } from "lucide-react";
import type { ManualTotals } from "../types";

interface TotalModeSectionProps {
  manualTotals: ManualTotals;
  handleManualChange: (section: string, field: string, value: string) => void;
}

export const TotalModeSection: React.FC<TotalModeSectionProps> = ({
  manualTotals,
  handleManualChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-8 border-purple-600">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>إدخال التكاليف يدوياً (Total Mode)</span>
        <Layers className="w-6 h-6 text-purple-600" />
      </h2>

      <div className="space-y-6">
        {/* Frontend Input */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 p-4 rounded-lg">
          <div className="md:col-span-1 font-bold text-lg text-slate-700">
            Frontend
          </div>
          <div>
            <label
              htmlFor="feHoursTotal"
              className="text-xs font-bold text-gray-500"
            >
              الساعات
            </label>
            <input
              id="feHoursTotal"
              type="number"
              min="0"
              placeholder="0"
              title="إجمالي ساعات Frontend"
              className="w-full border p-2 rounded"
              value={manualTotals.frontend.hours}
              onChange={(e) =>
                handleManualChange("frontend", "hours", e.target.value)
              }
            />
          </div>
          <div>
            <label
              htmlFor="fePointsTotal"
              className="text-xs font-bold text-gray-500"
            >
              النقاط
            </label>
            <input
              id="fePointsTotal"
              type="number"
              min="0"
              placeholder="0"
              title="إجمالي نقاط Frontend"
              className="w-full border p-2 rounded"
              value={manualTotals.frontend.points}
              onChange={(e) =>
                handleManualChange("frontend", "points", e.target.value)
              }
            />
          </div>
          <div>
            <label
              htmlFor="feCostTotal"
              className="text-xs font-bold text-gray-500"
            >
              التكلفة (ج)
            </label>
            <input
              id="feCostTotal"
              type="number"
              min="0"
              placeholder="0"
              title="إجمالي تكلفة Frontend"
              className="w-full border p-2 rounded border-green-200 bg-green-50"
              value={manualTotals.frontend.cost}
              onChange={(e) =>
                handleManualChange("frontend", "cost", e.target.value)
              }
            />
          </div>
        </div>

        {/* Backend Input */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 p-4 rounded-lg">
          <div className="md:col-span-1 font-bold text-lg text-slate-700">
            Backend
          </div>
          <div>
            <label
              htmlFor="beHoursTotal"
              className="text-xs font-bold text-gray-500"
            >
              الساعات
            </label>
            <input
              id="beHoursTotal"
              type="number"
              min="0"
              placeholder="0"
              title="إجمالي ساعات Backend"
              className="w-full border p-2 rounded"
              value={manualTotals.backend.hours}
              onChange={(e) =>
                handleManualChange("backend", "hours", e.target.value)
              }
            />
          </div>
          <div>
            <label
              htmlFor="bePointsTotal"
              className="text-xs font-bold text-gray-500"
            >
              النقاط
            </label>
            <input
              id="bePointsTotal"
              type="number"
              min="0"
              placeholder="0"
              title="إجمالي نقاط Backend"
              className="w-full border p-2 rounded"
              value={manualTotals.backend.points}
              onChange={(e) =>
                handleManualChange("backend", "points", e.target.value)
              }
            />
          </div>
          <div>
            <label
              htmlFor="beCostTotal"
              className="text-xs font-bold text-gray-500"
            >
              التكلفة (ج)
            </label>
            <input
              id="beCostTotal"
              type="number"
              min="0"
              placeholder="0"
              title="إجمالي تكلفة Backend"
              className="w-full border p-2 rounded border-green-200 bg-green-50"
              value={manualTotals.backend.cost}
              onChange={(e) =>
                handleManualChange("backend", "cost", e.target.value)
              }
            />
          </div>
        </div>

        {/* UI Input */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 p-4 rounded-lg">
          <div className="md:col-span-1 font-bold text-lg text-slate-700">
            UI/UX
          </div>
          <div>
            <label
              htmlFor="uiHoursTotal"
              className="text-xs font-bold text-gray-500"
            >
              الساعات
            </label>
            <input
              id="uiHoursTotal"
              type="number"
              min="0"
              placeholder="0"
              title="إجمالي ساعات UI/UX"
              className="w-full border p-2 rounded"
              value={manualTotals.ui.hours}
              onChange={(e) =>
                handleManualChange("ui", "hours", e.target.value)
              }
            />
          </div>
          <div>
            <label
              htmlFor="uiPointsTotal"
              className="text-xs font-bold text-gray-500"
            >
              النقاط
            </label>
            <input
              id="uiPointsTotal"
              type="number"
              min="0"
              placeholder="0"
              title="إجمالي نقاط UI/UX"
              className="w-full border p-2 rounded"
              value={manualTotals.ui.points}
              onChange={(e) =>
                handleManualChange("ui", "points", e.target.value)
              }
            />
          </div>
          <div>
            <label
              htmlFor="uiCostTotal"
              className="text-xs font-bold text-gray-500"
            >
              التكلفة (ج)
            </label>
            <input
              id="uiCostTotal"
              type="number"
              min="0"
              placeholder="0"
              title="إجمالي تكلفة UI/UX"
              className="w-full border p-2 rounded border-green-200 bg-green-50"
              value={manualTotals.ui.cost}
              onChange={(e) => handleManualChange("ui", "cost", e.target.value)}
            />
          </div>
        </div>

        {/* Analysis Input */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 p-4 rounded-lg">
          <div className="md:col-span-1 font-bold text-lg text-slate-700">
            Analysis
          </div>
          <div>
            <label
              htmlFor="analysisHoursTotal"
              className="text-xs font-bold text-gray-500"
            >
              الساعات
            </label>
            <input
              id="analysisHoursTotal"
              type="number"
              min="0"
              placeholder="0"
              title="إجمالي ساعات Analysis"
              className="w-full border p-2 rounded"
              value={manualTotals.analysis.hours}
              onChange={(e) =>
                handleManualChange("analysis", "hours", e.target.value)
              }
            />
          </div>
          <div className="bg-gray-100 flex items-center justify-center text-gray-400 rounded">
            -
          </div>
          <div>
            <label
              htmlFor="analysisCostTotal"
              className="text-xs font-bold text-gray-500"
            >
              التكلفة (ج)
            </label>
            <input
              id="analysisCostTotal"
              type="number"
              min="0"
              placeholder="0"
              title="إجمالي تكلفة Analysis"
              className="w-full border p-2 rounded border-green-200 bg-green-50"
              value={manualTotals.analysis.cost}
              onChange={(e) =>
                handleManualChange("analysis", "cost", e.target.value)
              }
            />
          </div>
        </div>

        {/* Testing Input */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 p-4 rounded-lg">
          <div className="md:col-span-1 font-bold text-lg text-slate-700">
            Testing
          </div>
          <div>
            <label
              htmlFor="testingHoursTotal"
              className="text-xs font-bold text-gray-500"
            >
              الساعات
            </label>
            <input
              id="testingHoursTotal"
              type="number"
              min="0"
              placeholder="0"
              title="إجمالي ساعات Testing"
              className="w-full border p-2 rounded"
              value={manualTotals.testing.hours}
              onChange={(e) =>
                handleManualChange("testing", "hours", e.target.value)
              }
            />
          </div>
          <div className="bg-gray-100 flex items-center justify-center text-gray-400 rounded">
            -
          </div>
          <div>
            <label
              htmlFor="testingCostTotal"
              className="text-xs font-bold text-gray-500"
            >
              التكلفة (ج)
            </label>
            <input
              id="testingCostTotal"
              type="number"
              min="0"
              placeholder="0"
              title="إجمالي تكلفة Testing"
              className="w-full border p-2 rounded border-green-200 bg-green-50"
              value={manualTotals.testing.cost}
              onChange={(e) =>
                handleManualChange("testing", "cost", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
