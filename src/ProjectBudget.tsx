/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { Calculator, Download } from "lucide-react";
import {
  HourRateSection,
  ProjectTypeSection,
  BasePageSection,
  ProjectPagesSection,
  TotalModeSection,
  AnalysisTestingSection,
  SummarySection,
  ExternalServicesSection,
  FinalCostSection,
} from "./components";

import type {
  ProjectType,
  PricingType,
  BasePage,
  ProjectPage,
  ManualTotals,
} from "./types";

import {
  calculateHourRate,
  calculatePointCost,
  calculateTotals,
  calculateProjectCost,
  getSummaryRows,
  calculateTotalProjectPoints,
  generatePDF,
} from "./utils";

const ProjectBudget = () => {
  // Section 1: Hour Rate Calculation
  const [salary, setSalary] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [calculationFactor, setCalculationFactor] = useState("1.5");

  // Section 2 & 3: Project Type & Pricing Type
  const [projectType, setProjectType] = useState<ProjectType>("web");
  const [pricingType, setPricingType] = useState<PricingType>("total");

  // Section 4: Base Page
  const [basePage, setBasePage] = useState<BasePage>({
    name: "الصفحة الرئيسية",
    uiHours: "",
    frontendHours: "",
    backendHours: "",
    points: 1,
    notes: "",
  });

  // Section 5: Project Pages
  const [projectPages, setProjectPages] = useState<ProjectPage[]>([
    {
      id: 1,
      name: "",
      uiHours: "",
      frontendHours: "",
      backendHours: "",
      points: "",
      notes: "",
    },
  ]);

  // Section 6: Analysis & Testing
  const [analysisHours, setAnalysisHours] = useState("");
  const [testingHours, setTestingHours] = useState("");

  // Manual Totals (Total Mode)
  const [manualTotals, setManualTotals] = useState<ManualTotals>({
    frontend: { hours: "", points: "", cost: "" },
    backend: { hours: "", points: "", cost: "" },
    ui: { hours: "", points: "", cost: "" },
    analysis: { hours: "", cost: "" },
    testing: { hours: "", cost: "" },
  });

  // External Services
  const [domainCost, setDomainCost] = useState("");
  const [serverCost, setServerCost] = useState("");

  // Profit
  const [profitPercentage, setProfitPercentage] = useState("");

  // Helper for positive numbers
  const handlePositiveInput =
    (setter: (val: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      if (val < 0) return;
      setter(e.target.value);
    };

  const handleManualChange = (
    section: string,
    field: string,
    value: string
  ) => {
    if (parseFloat(value) < 0) return;
    setManualTotals((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Calculations
  const hourRate = useMemo(
    () => calculateHourRate(salary, hoursPerDay, calculationFactor),
    [salary, hoursPerDay, calculationFactor]
  );

  const pointCost = useMemo(
    () => calculatePointCost(basePage, hourRate, pricingType),
    [basePage, hourRate, pricingType]
  );

  const totals = useMemo(
    () =>
      calculateTotals(
        pricingType,
        manualTotals,
        basePage,
        projectPages,
        analysisHours,
        testingHours
      ),
    [
      pricingType,
      manualTotals,
      basePage,
      projectPages,
      analysisHours,
      testingHours,
    ]
  );

  const showProfit = pricingType === "total";
  const showExternalServices =
    pricingType === "backend" || pricingType === "total";

  const totalProjectHours = useMemo(() => {
    return (
      totals.totalUI +
      totals.totalFrontend +
      totals.totalBackend +
      totals.totalAnalysis +
      totals.totalTesting
    );
  }, [totals]);

  const totalProjectDays = useMemo(() => {
    return hoursPerDay && totalProjectHours > 0
      ? Math.ceil(totalProjectHours / parseFloat(hoursPerDay))
      : 0;
  }, [totalProjectHours, hoursPerDay]);

  const totalProjectPoints = useMemo(
    () => calculateTotalProjectPoints(totals, pricingType),
    [totals, pricingType]
  );

  const projectCost = useMemo(
    () =>
      calculateProjectCost(
        pricingType,
        manualTotals,
        pointCost,
        projectPages,
        analysisHours,
        testingHours,
        hourRate,
        domainCost,
        serverCost,
        showExternalServices
      ),
    [
      pricingType,
      manualTotals,
      pointCost,
      projectPages,
      analysisHours,
      testingHours,
      hourRate,
      domainCost,
      serverCost,
      showExternalServices,
    ]
  );

  const profitAmount = showProfit
    ? (projectCost * (parseFloat(profitPercentage) || 0)) / 100
    : 0;

  const finalCost = projectCost + profitAmount;
  const summaryRows = getSummaryRows(pricingType);

  // Add new project page
  const addProjectPage = () => {
    setProjectPages([
      ...projectPages,
      {
        id: Date.now(),
        name: "",
        uiHours: "",
        frontendHours: "",
        backendHours: "",
        points: "",
        notes: "",
      },
    ]);
  };

  // Remove project page
  const removeProjectPage = (id: number) => {
    setProjectPages(projectPages.filter((page) => page.id !== id));
  };

  // Update project page
  const updateProjectPage = (id: number, field: string, value: string) => {
    if (
      ["uiHours", "frontendHours", "backendHours", "points"].includes(field)
    ) {
      if (parseFloat(value) < 0) return;
    }
    setProjectPages(
      projectPages.map((page) =>
        page.id === id ? { ...page, [field]: value } : page
      )
    );
  };

  // Export to PDF
  const exportToPDF = () => {
    if (!salary || !hoursPerDay) {
      alert("⚠️ من فضلك أدخل البيانات الأساسية أولاً (الراتب وعدد الساعات)");
      return;
    }

    generatePDF({
      pricingType,
      projectType,
      hourRate,
      pointCost,
      basePage,
      projectPages,
      manualTotals,
      totals,
      summaryRows,
      hoursPerDay,
      totalProjectHours,
      totalProjectPoints,
      totalProjectDays,
      domainCost,
      serverCost,
      projectCost,
      profitPercentage,
      finalCost,
      showProfit,
      showExternalServices,
    });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              نظام تحديد تكلفة المشاريع
            </h1>
            <Calculator className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600">
            حساب دقيق وسريع لتكلفة المشاريع البرمجية
          </p>
        </div>

        {/* Components */}
        <HourRateSection
          salary={salary}
          setSalary={setSalary}
          hoursPerDay={hoursPerDay}
          setHoursPerDay={setHoursPerDay}
          calculationFactor={calculationFactor}
          setCalculationFactor={setCalculationFactor}
          hourRate={hourRate}
          handlePositiveInput={handlePositiveInput}
        />

        <ProjectTypeSection
          projectType={projectType}
          setProjectType={setProjectType}
          pricingType={pricingType}
          setPricingType={setPricingType}
        />

        {pricingType === "total" ? (
          <TotalModeSection
            manualTotals={manualTotals}
            handleManualChange={handleManualChange}
          />
        ) : (
          <>
            <BasePageSection
              basePage={basePage}
              setBasePage={setBasePage}
              pricingType={pricingType}
              pointCost={pointCost}
              handlePositiveInput={handlePositiveInput}
            />

            <ProjectPagesSection
              projectPages={projectPages}
              setProjectPages={setProjectPages}
              pricingType={pricingType}
              pointCost={pointCost}
              updateProjectPage={updateProjectPage}
              removeProjectPage={removeProjectPage}
              addProjectPage={addProjectPage}
            />

            <AnalysisTestingSection
              analysisHours={analysisHours}
              setAnalysisHours={setAnalysisHours}
              testingHours={testingHours}
              setTestingHours={setTestingHours}
              hourRate={hourRate}
              handlePositiveInput={handlePositiveInput}
            />
          </>
        )}

        <SummarySection
          totals={totals}
          summaryRows={summaryRows}
          hoursPerDay={hoursPerDay}
          totalProjectHours={totalProjectHours}
          totalProjectPoints={totalProjectPoints}
          totalProjectDays={totalProjectDays}
        />

        {showExternalServices && (
          <ExternalServicesSection
            domainCost={domainCost}
            setDomainCost={setDomainCost}
            serverCost={serverCost}
            setServerCost={setServerCost}
            handlePositiveInput={handlePositiveInput}
          />
        )}

        <FinalCostSection
          showProfit={showProfit}
          showExternalServices={showExternalServices}
          projectCost={projectCost}
          profitPercentage={profitPercentage}
          setProfitPercentage={setProfitPercentage}
          profitAmount={profitAmount}
          finalCost={finalCost}
          handlePositiveInput={handlePositiveInput}
        />

        {/* Export Button */}
        <button
          onClick={exportToPDF}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
        >
          <Download className="w-6 h-6" /> تصدير إلى PDF
        </button>
      </div>
    </div>
  );
};

export default ProjectBudget;
