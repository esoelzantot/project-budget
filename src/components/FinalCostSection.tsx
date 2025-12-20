// components/FinalCostSection.tsx
import React from "react";

interface FinalCostSectionProps {
  showProfit: boolean;
  showExternalServices: boolean;
  projectCost: number;
  profitPercentage: string;
  setProfitPercentage: (value: string) => void;
  profitAmount: number;
  finalCost: number;
  handlePositiveInput: (
    setter: (val: string) => void
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FinalCostSection: React.FC<FinalCostSectionProps> = ({
  showProfit,
  showExternalServices,
  projectCost,
  profitPercentage,
  setProfitPercentage,
  profitAmount,
  finalCost,
  handlePositiveInput,
}) => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-6 mb-6 text-white">
      <h2 className="text-2xl font-bold mb-4">
        {showProfit ? "8. التكلفة النهائية والربح" : "8. إجمالي تكلفة المشروع"}
      </h2>
      <div className="space-y-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <p className="text-lg">التكلفة الأساسية للمشروع</p>
          <p className="text-3xl font-bold">{projectCost.toFixed(2)} ج</p>
          {showExternalServices && (
            <p className="text-sm text-white/70 mt-1">
              (شاملة تكلفة الخدمات الخارجية)
            </p>
          )}
          {!showExternalServices && (
            <p className="text-sm text-white/70 mt-1">
              (غير شاملة الخدمات الخارجية)
            </p>
          )}
        </div>

        {showProfit && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <label
                  htmlFor="profitPercentage"
                  className="block text-sm font-semibold mb-2"
                >
                  نسبة الـ Profit (%)
                </label>
                <input
                  id="profitPercentage"
                  type="number"
                  min="0"
                  value={profitPercentage}
                  onChange={handlePositiveInput(setProfitPercentage)}
                  className="w-full px-4 py-2 border-2 border-white/30 bg-white/10 rounded-lg focus:border-white focus:outline-none text-white placeholder-white/50"
                  placeholder="20"
                  title="نسبة الربح المضافة على التكلفة الأساسية"
                />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">مبلغ الـ Profit</p>
                <p className="text-2xl font-bold">
                  {Math.ceil(profitAmount).toFixed(2)} ج
                </p>
              </div>
            </div>
            <div className="bg-white text-green-700 rounded-lg p-4 border-4 border-white/30">
              <p className="text-lg font-semibold">
                التكلفة النهائية (مع الربح)
              </p>
              <p className="text-4xl font-bold">
                {Math.ceil(finalCost).toFixed(2)} ج
              </p>
            </div>
          </>
        )}

        {!showProfit && (
          <div className="bg-white text-green-700 rounded-lg p-4 border-4 border-white/30">
            <p className="text-lg font-semibold">التكلفة الإجمالية</p>
            <p className="text-4xl font-bold">
              {Math.ceil(finalCost).toFixed(2)} ج
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
