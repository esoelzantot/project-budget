// utils/utils.ts
import type {
  BasePage,
  ManualTotals,
  PricingType,
  ProjectPage,
  Totals,
} from "../types";

export const calculateHourRate = (
  salary: string,
  hoursPerDay: string,
  calculationFactor: string
): number => {
  if (salary && hoursPerDay && calculationFactor) {
    const rate =
      (parseFloat(salary) / 30 / parseFloat(hoursPerDay)) *
      parseFloat(calculationFactor);
    return Math.ceil(rate);
  }
  return 0;
};

export const calculatePointCost = (
  basePage: BasePage,
  hourRate: number,
  pricingType: PricingType
): number => {
  let totalHours = 0;
  if (pricingType !== "total") {
    if (pricingType === "frontend") {
      totalHours = parseFloat(basePage.frontendHours) || 0;
    } else if (pricingType === "backend") {
      totalHours = parseFloat(basePage.backendHours) || 0;
    } else if (pricingType === "ui/ux") {
      totalHours = parseFloat(basePage.uiHours) || 0;
    }
  }
  return totalHours * hourRate;
};

export const calculateTotals = (
  pricingType: PricingType,
  manualTotals: ManualTotals,
  basePage: BasePage,
  projectPages: ProjectPage[],
  analysisHours: string,
  testingHours: string
): Totals => {
  if (pricingType === "total") {
    return {
      totalUI: parseFloat(manualTotals.ui.hours) || 0,
      totalFrontend: parseFloat(manualTotals.frontend.hours) || 0,
      totalBackend: parseFloat(manualTotals.backend.hours) || 0,
      totalAnalysis: parseFloat(manualTotals.analysis.hours) || 0,
      totalTesting: parseFloat(manualTotals.testing.hours) || 0,
      pointsUI: parseFloat(manualTotals.ui.points) || 0,
      pointsFrontend: parseFloat(manualTotals.frontend.points) || 0,
      pointsBackend: parseFloat(manualTotals.backend.points) || 0,
    };
  } else {
    let totalUI = parseFloat(basePage.uiHours) || 0;
    let totalFrontend = parseFloat(basePage.frontendHours) || 0;
    let totalBackend = parseFloat(basePage.backendHours) || 0;

    let pointsUI = 1;
    let pointsFrontend = 1;
    let pointsBackend = 1;

    projectPages.forEach((page) => {
      const pPoints = parseFloat(page.points) || 0;
      totalUI += parseFloat(page.uiHours) || 0;
      totalFrontend += parseFloat(page.frontendHours) || 0;
      totalBackend += parseFloat(page.backendHours) || 0;

      pointsUI += pPoints;
      pointsFrontend += pPoints;
      pointsBackend += pPoints;
    });

    const totalAnalysis = parseFloat(analysisHours) || 0;
    const totalTesting = parseFloat(testingHours) || 0;

    return {
      totalUI,
      totalFrontend,
      totalBackend,
      totalAnalysis,
      totalTesting,
      pointsUI,
      pointsFrontend,
      pointsBackend,
    };
  }
};

export const calculateProjectCost = (
  pricingType: PricingType,
  manualTotals: ManualTotals,
  pointCost: number,
  projectPages: ProjectPage[],
  analysisHours: string,
  testingHours: string,
  hourRate: number,
  domainCost: string,
  serverCost: string,
  showExternalServices: boolean
): number => {
  const externalServices = showExternalServices
    ? (parseFloat(domainCost) || 0) + (parseFloat(serverCost) || 0)
    : 0;

  if (pricingType === "total") {
    const manualCost =
      (parseFloat(manualTotals.frontend.cost) || 0) +
      (parseFloat(manualTotals.backend.cost) || 0) +
      (parseFloat(manualTotals.ui.cost) || 0) +
      (parseFloat(manualTotals.analysis.cost) || 0) +
      (parseFloat(manualTotals.testing.cost) || 0);
    return manualCost + externalServices;
  } else {
    let pageCost = pointCost;

    projectPages.forEach((page) => {
      const points = parseFloat(page.points) || 0;
      pageCost += points * pointCost;
    });

    const analysisCost = (parseFloat(analysisHours) || 0) * hourRate;
    const testingCost = (parseFloat(testingHours) || 0) * hourRate;

    return pageCost + analysisCost + testingCost + externalServices;
  }
};

export const getSummaryRows = (pricingType: PricingType): string[] => {
  const common = ["analysis", "testing"];
  if (pricingType === "total")
    return ["ui", "frontend", "backend", "analysis", "testing"];
  if (pricingType === "frontend") return ["frontend", ...common];
  if (pricingType === "backend") return ["backend", ...common];
  if (pricingType === "ui/ux") return ["ui", ...common];
  return ["ui", "frontend", "backend", ...common];
};

export const calculateTotalProjectPoints = (
  totals: Totals,
  pricingType: PricingType
): number => {
  if (pricingType === "total") {
    return totals.pointsUI + totals.pointsFrontend + totals.pointsBackend;
  } else {
    return totals.pointsUI;
  }
};
