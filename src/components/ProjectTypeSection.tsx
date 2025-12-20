// components/ProjectTypeSection.tsx
import React from "react";
import type { ProjectType, PricingType } from "../types";

interface ProjectTypeSectionProps {
  projectType: ProjectType;
  setProjectType: (type: ProjectType) => void;
  pricingType: PricingType;
  setPricingType: (type: PricingType) => void;
}

export const ProjectTypeSection: React.FC<ProjectTypeSectionProps> = ({
  projectType,
  setProjectType,
  pricingType,
  setPricingType,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          2. نوع المشروع
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {(["web", "mobile", "desktop"] as ProjectType[]).map((type) => (
            <button
              key={type}
              onClick={() => setProjectType(type)}
              className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                projectType === type
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-pressed={projectType === type ? "true" : "false"}
              title={`تحديد نوع المشروع كـ ${type}`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          3. نوع التسعيرة
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {(["frontend", "backend", "ui/ux", "total"] as PricingType[]).map(
            (type) => (
              <button
                key={type}
                onClick={() => setPricingType(type)}
                className={`py-3 px-4 rounded-lg font-semibold transition-all text-sm ${
                  pricingType === type
                    ? "bg-purple-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                aria-pressed={pricingType === type ? "true" : "false"}
                title={`تحديد التسعيرة على أساس ${
                  type === "ui/ux" ? "UI/UX" : type
                }`}
              >
                {type === "ui/ux" ? "UI/UX" : type.toUpperCase()}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
