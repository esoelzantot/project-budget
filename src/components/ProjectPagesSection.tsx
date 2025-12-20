// components/ProjectPagesSection.tsx
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ProjectPage, PricingType } from "../types";

interface ProjectPagesSectionProps {
  projectPages: ProjectPage[];
  setProjectPages: (pages: ProjectPage[]) => void;
  pricingType: PricingType;
  pointCost: number;
  updateProjectPage: (id: number, field: string, value: string) => void;
  removeProjectPage: (id: number) => void;
  addProjectPage: () => void;
}

export const ProjectPagesSection: React.FC<ProjectPagesSectionProps> = ({
  projectPages,
  pricingType,
  pointCost,
  updateProjectPage,
  removeProjectPage,
  addProjectPage,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        5. صفحات المشروع
      </h2>
      <div className="space-y-4">
        {projectPages.map((page, index) => (
          <div
            key={page.id}
            className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-700">صفحة {index + 1}</h3>
              <button
                onClick={() => removeProjectPage(page.id)}
                className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                title={`حذف صفحة ${index + 1}`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label
                  htmlFor={`pageName-${page.id}`}
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  اسم الصفحة
                </label>
                <input
                  id={`pageName-${page.id}`}
                  type="text"
                  value={page.name}
                  onChange={(e) =>
                    updateProjectPage(page.id, "name", e.target.value)
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder={`صفحة ${index + 1}`}
                  title={`اسم صفحة ${index + 1}`}
                />
              </div>

              {pricingType === "ui/ux" && (
                <div>
                  <label
                    htmlFor={`pageUIHours-${page.id}`}
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    ساعات UI
                  </label>
                  <input
                    id={`pageUIHours-${page.id}`}
                    type="number"
                    min="0"
                    value={page.uiHours}
                    onChange={(e) =>
                      updateProjectPage(page.id, "uiHours", e.target.value)
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    title={`ساعات UI/UX لصفحة ${index + 1}`}
                  />
                </div>
              )}
              {pricingType === "frontend" && (
                <div>
                  <label
                    htmlFor={`pageFEHours-${page.id}`}
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    ساعات Frontend
                  </label>
                  <input
                    id={`pageFEHours-${page.id}`}
                    type="number"
                    min="0"
                    value={page.frontendHours}
                    onChange={(e) =>
                      updateProjectPage(
                        page.id,
                        "frontendHours",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    title={`ساعات Frontend لصفحة ${index + 1}`}
                  />
                </div>
              )}
              {pricingType === "backend" && (
                <div>
                  <label
                    htmlFor={`pageBEHours-${page.id}`}
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    ساعات Backend
                  </label>
                  <input
                    id={`pageBEHours-${page.id}`}
                    type="number"
                    min="0"
                    value={page.backendHours}
                    onChange={(e) =>
                      updateProjectPage(page.id, "backendHours", e.target.value)
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    title={`ساعات Backend لصفحة ${index + 1}`}
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor={`pagePoints-${page.id}`}
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  عدد الـ Points
                </label>
                <input
                  id={`pagePoints-${page.id}`}
                  type="number"
                  min="0"
                  value={page.points}
                  onChange={(e) =>
                    updateProjectPage(page.id, "points", e.target.value)
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  title={`عدد نقاط صفحة ${index + 1}`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  التكلفة
                </label>
                <div
                  className="w-full px-4 py-2 bg-green-50 border-2 border-green-300 rounded-lg text-green-700 font-bold"
                  title={`التكلفة الإجمالية لصفحة ${index + 1}`}
                >
                  {((parseFloat(page.points) || 0) * pointCost).toFixed(2)} ج
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor={`pageNotes-${page.id}`}
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                ملاحظات (اختياري)
              </label>
              <textarea
                id={`pageNotes-${page.id}`}
                value={page.notes}
                onChange={(e) =>
                  updateProjectPage(page.id, "notes", e.target.value)
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none h-16"
                placeholder={`ملاحظات خاصة بصفحة ${index + 1}`}
                title={`ملاحظات حول صفحة ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addProjectPage}
        className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" /> إضافة صفحة جديدة
      </button>
    </div>
  );
};
