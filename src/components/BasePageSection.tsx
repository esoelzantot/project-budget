// components/BasePageSection.tsx
import React from "react";
import type { BasePage, PricingType } from "../types";

interface BasePageSectionProps {
  basePage: BasePage;
  setBasePage: (page: BasePage) => void;
  pricingType: PricingType;
  pointCost: number;
  handlePositiveInput: (
    setter: (val: string) => void
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BasePageSection: React.FC<BasePageSectionProps> = ({
  basePage,
  setBasePage,
  pricingType,
  pointCost,
  handlePositiveInput,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        4. الصفحة الأساسية (Base Page)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <div className="md:col-span-1">
          <label
            htmlFor="basePageName"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            اسم الصفحة
          </label>
          <input
            id="basePageName"
            type="text"
            value={basePage.name}
            onChange={(e) => setBasePage({ ...basePage, name: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            title="اسم الصفحة الأساسية"
          />
        </div>
        {pricingType === "ui/ux" && (
          <div>
            <label
              htmlFor="basePageUIHours"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              ساعات UI
            </label>
            <input
              id="basePageUIHours"
              type="number"
              min="0"
              value={basePage.uiHours}
              onChange={handlePositiveInput((val) =>
                setBasePage({ ...basePage, uiHours: val })
              )}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              title="ساعات UI/UX للصفحة الأساسية"
            />
          </div>
        )}
        {pricingType === "frontend" && (
          <div>
            <label
              htmlFor="basePageFEHours"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              ساعات Frontend
            </label>
            <input
              id="basePageFEHours"
              type="number"
              min="0"
              value={basePage.frontendHours}
              onChange={handlePositiveInput((val) =>
                setBasePage({ ...basePage, frontendHours: val })
              )}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              title="ساعات Frontend للصفحة الأساسية"
            />
          </div>
        )}
        {pricingType === "backend" && (
          <div>
            <label
              htmlFor="basePageBEHours"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              ساعات Backend
            </label>
            <input
              id="basePageBEHours"
              type="number"
              min="0"
              value={basePage.backendHours}
              onChange={handlePositiveInput((val) =>
                setBasePage({ ...basePage, backendHours: val })
              )}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              title="ساعات Backend للصفحة الأساسية"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            عدد الـ Points
          </label>
          <div className="w-full px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-700 font-bold">
            1
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 mb-4">
        <label
          htmlFor="basePageNotes"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          ملاحظات (اختياري)
        </label>
        <textarea
          id="basePageNotes"
          value={basePage.notes}
          onChange={(e) => setBasePage({ ...basePage, notes: e.target.value })}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none h-20"
          placeholder="أضف أي ملاحظات خاصة بالصفحة الأساسية هنا"
          title="ملاحظات حول الصفحة الأساسية"
        />
      </div>

      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
        <p className="font-bold text-blue-900">
          تكلفة الـ Point:{" "}
          <span className="text-2xl">{pointCost.toFixed(2)} ج</span>
        </p>
      </div>
    </div>
  );
};
