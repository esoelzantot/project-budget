/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Download,
  Calculator,
  DollarSign,
  Clock,
  FileText,
  Layers,
} from "lucide-react";

const ProjectBudget = () => {
  // Section 1: Hour Rate Calculation
  const [salary, setSalary] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [calculationFactor, setCalculationFactor] = useState("1.5");

  // Section 2 & 3: Project Type & Pricing Type
  const [projectType, setProjectType] = useState("web");
  const [pricingType, setPricingType] = useState("total"); // Default to total or web based on preference

  // Section 4: Base Page (Standard Mode)
  const [basePage, setBasePage] = useState({
    name: "الصفحة الرئيسية", // Changed default name for better Arabic context in PDF
    uiHours: "",
    frontendHours: "",
    backendHours: "",
    points: 1,
    notes: "", // NEW FIELD
  });

  // Section 5: Project Pages (Standard Mode)
  const [projectPages, setProjectPages] = useState([
    {
      id: 1,
      name: "",
      uiHours: "",
      frontendHours: "",
      backendHours: "",
      points: "",
      notes: "", // NEW FIELD
    },
  ]);

  // Section 6: Analysis & Testing (Standard Mode)
  const [analysisHours, setAnalysisHours] = useState("");
  const [testingHours, setTestingHours] = useState("");

  // Section: Manual Totals (Total Mode Only)
  const [manualTotals, setManualTotals] = useState({
    frontend: { hours: "", points: "", cost: "" },
    backend: { hours: "", points: "", cost: "" },
    ui: { hours: "", points: "", cost: "" },
    analysis: { hours: "", cost: "" },
    testing: { hours: "", cost: "" },
  });

  // Section 7.5: External Services
  const [domainCost, setDomainCost] = useState("");
  const [serverCost, setServerCost] = useState("");

  // Section 8: Profit
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

  // Calculate hour rate
  const hourRate = React.useMemo(() => {
    if (salary && hoursPerDay && calculationFactor) {
      const rate =
        (parseFloat(salary) / 30 / parseFloat(hoursPerDay)) *
        parseFloat(calculationFactor);
      return Math.ceil(rate);
    }
    return 0;
  }, [salary, hoursPerDay, calculationFactor]);

  // Calculate point cost from base page (Only relevant in Standard Mode)
  const pointCost = React.useMemo(() => {
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
  }, [basePage, hourRate, pricingType]);

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
        notes: "", // NEW FIELD
      },
    ]);
  };

  // Remove project page
  const removeProjectPage = (id: number) => {
    setProjectPages(projectPages.filter((page) => page.id !== id));
  };

  // Update project page (Modified to handle non-numeric fields like notes and name)
  const updateProjectPage = (id: number, field: string, value: string) => {
    // Only apply positive check to numeric fields
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

  // Calculate totals (Unified for both modes)
  const calculateTotals = () => {
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
      // Standard Mode Calculation
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

  const totals = calculateTotals();

  // --- Start of New Conditional Logic ---
  // Profit & Final Cost are visible only if Total
  const showProfit = pricingType === "total";
  // External Services are visible only if Backend or Total
  const showExternalServices =
    pricingType === "backend" || pricingType === "total";
  // --- End of New Conditional Logic ---

  // NEW CALCULATION FOR TOTAL HOURS/DAYS
  const totalProjectHours = React.useMemo(() => {
    return (
      totals.totalUI +
      totals.totalFrontend +
      totals.totalBackend +
      totals.totalAnalysis +
      totals.totalTesting
    );
  }, [totals]);

  const totalProjectDays = React.useMemo(() => {
    return hoursPerDay && totalProjectHours > 0
      ? Math.ceil(totalProjectHours / parseFloat(hoursPerDay))
      : 0;
  }, [totalProjectHours, hoursPerDay]);

  // NEW: TOTAL PROJECT POINTS (Requested by user)
  const totalProjectPoints = React.useMemo(() => {
    if (pricingType === "total") {
      // في وضع Total: يتم جمع النقاط المدخلة يدوياً لكل قسم
      return totals.pointsUI + totals.pointsFrontend + totals.pointsBackend;
    } else {
      // في الوضع القياسي (Frontend, Backend, UI/UX):
      // يتم احتساب النقاط مرة واحدة فقط، حيث أن (pointsUI) يمثل إجمالي نقاط الصفحات.
      return totals.pointsUI;
    }
  }, [totals, pricingType]); // تمت إضافة pricingType كـ dependency
  // END NEW CALCULATION

  // Calculate project cost
  const calculateProjectCost = () => {
    // Services cost is 0 if not visible
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
      let pageCost = pointCost; // Base page cost

      projectPages.forEach((page) => {
        const points = parseFloat(page.points) || 0;
        pageCost += points * pointCost;
      });

      const analysisCost = (parseFloat(analysisHours) || 0) * hourRate;
      const testingCost = (parseFloat(testingHours) || 0) * hourRate;

      return pageCost + analysisCost + testingCost + externalServices;
    }
  };

  const projectCost = calculateProjectCost();

  // Profit calculation is 0 if not visible
  const profitAmount = showProfit
    ? (projectCost * (parseFloat(profitPercentage) || 0)) / 100
    : 0;

  const finalCost = projectCost + profitAmount;

  // Determine which rows to show in summary
  const getSummaryRows = () => {
    const common = ["analysis", "testing"];
    if (pricingType === "total")
      return ["ui", "frontend", "backend", "analysis", "testing"];
    if (pricingType === "frontend") return ["frontend", ...common];
    if (pricingType === "backend") return ["backend", ...common];
    if (pricingType === "ui/ux") return ["ui", ...common];
    return ["ui", "frontend", "backend", ...common];
  };

  const summaryRows = getSummaryRows();

  // Export to PDF function
  const exportToPDF = () => {
    if (!salary || !hoursPerDay) {
      alert("⚠️ من فضلك أدخل البيانات الأساسية أولاً (الراتب وعدد الساعات)");
      return;
    }

    const isTotalMode = pricingType === "total";
    const showProfitPDF = isTotalMode; // Only show profit in Total mode
    const showExternalServicesPDF = pricingType === "backend" || isTotalMode; // Show if Backend or Total

    // --- START: PDF Content Logic for Standard Mode ---
    let hourField: "uiHours" | "frontendHours" | "backendHours" | "" = "";
    let hourLabel = "";

    if (!isTotalMode) {
      if (pricingType === "frontend") {
        hourField = "frontendHours";
        hourLabel = "Frontend";
      } else if (pricingType === "backend") {
        hourField = "backendHours";
        hourLabel = "Backend";
      } else if (pricingType === "ui/ux") {
        hourField = "uiHours";
        hourLabel = "UI/UX";
      }
    }
    // --- END: PDF Content Logic for Standard Mode ---

    // Create PDF content
    const pdfContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 210mm; margin: 0 auto; padding: 20mm; background: white; color: #000; direction: rtl;">
        
        <div style="border-bottom: 4px solid #1e40af; padding-bottom: 15px; margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h1 style="margin: 0; font-size: 28px; color: #1e40af; font-weight: 700;">تقرير تكلفة المشروع</h1>
              <p style="margin: 5px 0 0 0; color: #64748b; font-size: 13px;">Project Cost Estimation Report</p>
            </div>
            <div style="text-align: left;">
              <div><strong>التاريخ:</strong> ${new Date().toLocaleDateString(
                "ar-EG"
              )}</div>     
            </div>
          </div>
        </div>

        <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-right: 6px solid #1e40af; padding: 20px; margin-bottom: 30px; border-radius: 4px; page-break-inside: avoid;">
          <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1e40af; font-weight: 600;">ملخص المشروع</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; width: 30%; font-weight: 600; color: #475569;">نوع المشروع:</td>
              <td style="padding: 8px 0; color: #1e293b;"><span style="background: #dbeafe; padding: 4px 12px; border-radius: 4px; font-weight: 500;">${projectType.toUpperCase()}</span></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #475569;">نوع التسعيرة:</td>
              <td style="padding: 8px 0; color: #1e293b;"><span style="background: #e9d5ff; padding: 4px 12px; border-radius: 4px; font-weight: 500;">${
                pricingType === "ui/ux" ? "UI/UX" : pricingType.toUpperCase()
              }</span></td>
            </tr>
            ${
              !isTotalMode
                ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #475569;">سعر الساعة:</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${hourRate} جنيه</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #475569;">تكلفة الـ Point:</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${pointCost.toFixed(
                2
              )} جنيه</td>
            </tr>
            `
                : ""
            }
          </table>
        </div>

        ${
          !isTotalMode
            ? `
        <div style="margin-bottom: 30px; page-break-inside: avoid;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">الصفحة الأساسية (${hourLabel} Base Page)</h2>
           <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; text-align: center;">
             <thead style="background: #f1f5f9;">
               <tr>
                 <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">العنوان</th>
                 <th style="padding: 10px; border: 1px solid #e2e8f0;">عدد الساعات (${hourLabel})</th>
                 <th style="padding: 10px; border: 1px solid #e2e8f0;">عدد النقاط</th>
               </tr>
             </thead>
             <tbody>
               <tr>
                 <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; text-align: right;">${
                   basePage.name
                 }</td>
                 <td style="padding: 10px; border: 1px solid #e2e8f0;">${
                   // Access the correct hours field dynamically
                   hourField
                     ? basePage[hourField as keyof typeof basePage] || 0
                     : 0
                 }</td>
                 <td style="padding: 10px; border: 1px solid #e2e8f0;">1</td>
               </tr>
             </tbody>
           </table>
           
           ${
             basePage.notes
               ? `
            <div style="background: #fff; border: 1px solid #e2e8f0; border-right: 4px solid #f97316; padding: 10px; border-radius: 4px; margin-top: 15px;">
                <p style="margin: 0 0 5px 0; font-weight: 600; color: #f97316; font-size: 13px;">ملاحظات الصفحة الأساسية:</p>
                <p style="margin: 0; color: #1e293b; white-space: pre-wrap; font-size: 14px;">${basePage.notes}</p>
            </div>
           `
               : ""
           }
           
        </div>

        <div style="margin-bottom: 30px; page-break-inside: avoid;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">صفحات المشروع</h2>
          <table style="width: 100%; border-collapse: collapse; text-align: center;">
            <thead style="background: #f1f5f9;">
              <tr>
                <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">العنوان</th>
                <th style="padding: 10px; border: 1px solid #e2e8f0;">عدد الساعات (${hourLabel})</th>
                <th style="padding: 10px; border: 1px solid #e2e8f0;">عدد النقاط</th>
              </tr>
            </thead>
            <tbody>
              ${projectPages
                .map((page, index) => {
                  // Determine the correct hour field for project pages
                  const pageHours = hourField
                    ? page[hourField as keyof (typeof projectPages)[0]] || 0
                    : 0;

                  return `
                  <tr>
                    <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; text-align: right;">${
                      page.name || `صفحة ${index + 1}`
                    }</td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0;">${pageHours}</td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0;">${
                      page.points || 0
                    }</td>
                  </tr>
                  ${
                    page.notes
                      ? `
                  <tr>
                      <td colspan="3" style="padding: 5px 10px; border: 1px solid #e2e8f0; background: #fafafa; text-align: right; font-size: 13px;">
                          <span style="font-weight: 600; color: #475569;">ملاحظات: </span>
                          <span style="white-space: pre-wrap;">${page.notes}</span>
                      </td>
                  </tr>
                  `
                      : ""
                  }
                `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
        `
            : `
        <div style="margin-bottom: 30px; page-break-inside: avoid;">
           <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">تفاصيل التكلفة المدخلة</h2>
           <table style="width: 100%; border-collapse: collapse; text-align: center;">
            <thead style="background: #f1f5f9;">
              <tr>
                <th style="padding: 10px; border: 1px solid #e2e8f0;">القسم</th>
                <th style="padding: 10px; border: 1px solid #e2e8f0;">الساعات</th>
                <th style="padding: 10px; border: 1px solid #e2e8f0;">النقاط</th>
                <th style="padding: 10px; border: 1px solid #e2e8f0;">التكلفة</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Frontend</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${
                  manualTotals.frontend.hours || 0
                }</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${
                  manualTotals.frontend.points || 0
                }</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${
                  manualTotals.frontend.cost || 0
                } ج</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Backend</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${
                  manualTotals.backend.hours || 0
                }</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${
                  manualTotals.backend.points || 0
                }</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${
                  manualTotals.backend.cost || 0
                } ج</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">UI/UX</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${
                  manualTotals.ui.hours || 0
                }</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${
                  manualTotals.ui.points || 0
                }</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${
                  manualTotals.ui.cost || 0
                } ج</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Analysis</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${
                  manualTotals.analysis.hours || 0
                }</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">-</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${
                  manualTotals.analysis.cost || 0
                } ج</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Testing</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${
                  manualTotals.testing.hours || 0
                }</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">-</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${
                  manualTotals.testing.cost || 0
                } ج</td>
              </tr>
            </tbody>
           </table>
        </div>
        `
        }

        <div style="margin-bottom: 30px; page-break-inside: avoid;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">ملخص الساعات والأيام</h2>
          <table style="width: 100%; border-collapse: collapse; text-align: center;">
            <thead>
              <tr style="background: #1e40af; color: white;">
                <th style="padding: 12px; text-align: right; border: 1px solid #1e40af;">القسم</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #1e40af;">عدد الساعات</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #1e40af;">عدد النقاط</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #1e40af;">عدد الأيام</th>
              </tr>
            </thead>
            <tbody>
              ${
                summaryRows.includes("ui")
                  ? `
              <tr>
                <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">UI/UX</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">${
                  totals.totalUI
                }</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">${
                  totals.pointsUI
                }</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">${
                  hoursPerDay
                    ? Math.ceil(totals.totalUI / parseFloat(hoursPerDay))
                    : 0
                }</td>
              </tr>`
                  : ""
              }
              ${
                summaryRows.includes("frontend")
                  ? `
              <tr>
                <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Frontend</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">${
                  totals.totalFrontend
                }</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">${
                  totals.pointsFrontend
                }</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">${
                  hoursPerDay
                    ? Math.ceil(totals.totalFrontend / parseFloat(hoursPerDay))
                    : 0
                }</td>
              </tr>`
                  : ""
              }
              ${
                summaryRows.includes("backend")
                  ? `
              <tr>
                <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Backend</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">${
                  totals.totalBackend
                }</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">${
                  totals.pointsBackend
                }</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">${
                  hoursPerDay
                    ? Math.ceil(totals.totalBackend / parseFloat(hoursPerDay))
                    : 0
                }</td>
              </tr>`
                  : ""
              }
              ${
                summaryRows.includes("analysis")
                  ? `
              <tr>
                <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Analysis</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">${
                  totals.totalAnalysis
                }</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">-</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">${
                  hoursPerDay
                    ? Math.ceil(totals.totalAnalysis / parseFloat(hoursPerDay))
                    : 0
                }</td>
              </tr>`
                  : ""
              }
              ${
                summaryRows.includes("testing")
                  ? `
              <tr>
                <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Testing</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">${
                  totals.totalTesting
                }</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">-</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">${
                  hoursPerDay
                    ? Math.ceil(totals.totalTesting / parseFloat(hoursPerDay))
                    : 0
                }</td>
              </tr>`
                  : ""
              }
              
              <tr style="background: #dbeafe; font-weight: 700;">
                <td style="padding: 10px 15px; border: 1px solid #e2e8f0; font-weight: 700; color: #1e40af;">الإجمالي الكلي للمشروع</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">${totalProjectHours.toFixed(
                  2
                )}</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">${totalProjectPoints}</td>
                <td style="text-align: center; border: 1px solid #e2e8f0;">${totalProjectDays}</td>
              </tr>
              </tbody>
          </table>
        </div>

        ${
          showExternalServicesPDF
            ? `
        <div style="margin-bottom: 30px; page-break-inside: avoid;">
            <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">الخدمات الخارجية</h2>
            <table style="width: 100%; border-collapse: collapse;">
                 <tr style="background: #f8fafc;">
                    <td style="padding: 10px 15px; width: 30%; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">تكلفة الدومين</td>
                    <td style="padding: 10px 15px; border: 1px solid #e2e8f0;">${(
                      parseFloat(domainCost) || 0
                    ).toFixed(2)} ج</td>
                </tr>
                 <tr>
                    <td style="padding: 10px 15px; width: 30%; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">تكلفة السيرفر</td>
                    <td style="padding: 10px 15px; border: 1px solid #e2e8f0;">${(
                      parseFloat(serverCost) || 0
                    ).toFixed(2)} ج</td>
                </tr>
                 <tr style="background: #e0f2f1;">
                    <td style="padding: 10px 15px; width: 30%; font-weight: 700; color: #0f766e; border: 1px solid #e2e8f0;">الإجمالي</td>
                    <td style="padding: 10px 15px; font-weight: 700; color: #0f766e; border: 1px solid #e2e8f0;">${(
                      (parseFloat(domainCost) || 0) +
                      (parseFloat(serverCost) || 0)
                    ).toFixed(2)} ج</td>
                </tr>
            </table>
        </div>
        `
            : ""
        }

        <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; page-break-inside: avoid;">
           <p style="margin: 0; font-weight: bold; color: #1e40af; font-size: 16px;">التكلفة الأساسية للمشروع: ${projectCost.toFixed(
             2
           )} جنيه</p>
           <p style="margin: 5px 0; font-weight: bold; color: #475569; font-size: 12px;">(${
             showExternalServicesPDF
               ? "شاملة تكلفة الخدمات الخارجية"
               : "غير شاملة الخدمات الخارجية"
           })</p>

           ${
             showProfitPDF
               ? `
           <div style="border-top: 2px solid #10b981; margin-top: 10px; padding-top: 10px;">
             <p style="margin: 0; font-weight: bold; color: #10b981; font-size: 20px;">التكلفة النهائية (مع إضافة ${
               profitPercentage || 0
             }% ربح): ${Math.ceil(finalCost).toFixed(2)} جنيه</p>
           </div>
           `
               : `
           <div style="border-top: 2px solid #1e40af; margin-top: 10px; padding-top: 10px;">
             <p style="margin: 0; font-weight: bold; color: #1e40af; font-size: 20px;">التكلفة النهائية: ${Math.ceil(
               finalCost
             ).toFixed(2)} جنيه</p>
           </div>
           `
           }
        </div>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>تقرير تكلفة المشروع</title>
          <style>body{margin:0;padding:0;background:white;} @page{size:A4;margin:10mm;}</style>
        </head>
        <body>${pdfContent}<script>window.onload=function(){setTimeout(function(){window.print();},500);};</script></body>
        </html>
      `);
      printWindow.document.close();
    }
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

        {/* Section 1: Hour Rate */}
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

        {/* Section 2 & 3: Project Type & Pricing Type - Buttons don't need labels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              2. نوع المشروع
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {["web", "mobile", "desktop"].map((type) => (
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
              {/* Removed Analysis and Testing as selectable pricing types */}
              {["frontend", "backend", "ui/ux", "total"].map((type) => (
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
              ))}
            </div>
          </div>
        </div>

        {/* CONDITIONAL RENDERING BASED ON PRICING TYPE */}
        {pricingType === "total" ? (
          // SECTION FOR TOTAL PRICING
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
                    onChange={(e) =>
                      handleManualChange("ui", "cost", e.target.value)
                    }
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
        ) : (
          // STANDARD MODE SECTIONS (4, 5, 6)
          <>
            {/* Section 4: Base Page */}
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
                    onChange={(e) =>
                      setBasePage({ ...basePage, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    title="اسم الصفحة الأساسية"
                  />
                </div>
                {/* Dynamically Show Fields based on Pricing Type */}
                {(pricingType === "ui/ux" || pricingType === "web") && (
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
                {(pricingType === "frontend" || pricingType === "web") && (
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
                {(pricingType === "backend" || pricingType === "web") && (
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

              {/* NEW: Base Page Notes */}
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
                  onChange={(e) =>
                    setBasePage({ ...basePage, notes: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none h-20"
                  placeholder="أضف أي ملاحظات خاصة بالصفحة الأساسية هنا"
                  title="ملاحظات حول الصفحة الأساسية"
                />
              </div>
              {/* END NEW */}

              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                <p className="font-bold text-blue-900">
                  تكلفة الـ Point:{" "}
                  <span className="text-2xl">{pointCost.toFixed(2)} ج</span>
                </p>
              </div>
            </div>

            {/* Section 5: Project Pages */}
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
                      <h3 className="font-bold text-gray-700">
                        صفحة {index + 1}
                      </h3>
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

                      {/* Conditional Inputs for Project Pages */}
                      {(pricingType === "ui/ux" || pricingType === "web") && (
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
                              updateProjectPage(
                                page.id,
                                "uiHours",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            title={`ساعات UI/UX لصفحة ${index + 1}`}
                          />
                        </div>
                      )}
                      {(pricingType === "frontend" ||
                        pricingType === "web") && (
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
                      {(pricingType === "backend" || pricingType === "web") && (
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
                              updateProjectPage(
                                page.id,
                                "backendHours",
                                e.target.value
                              )
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
                          {((parseFloat(page.points) || 0) * pointCost).toFixed(
                            2
                          )}{" "}
                          ج
                        </div>
                      </div>
                    </div>

                    {/* NEW: Project Page Notes */}
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
                    {/* END NEW */}
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

            {/* Section 6: Analysis & Testing */}
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
                        {((parseFloat(analysisHours) || 0) * hourRate).toFixed(
                          2
                        )}{" "}
                        ج
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
                        {((parseFloat(testingHours) || 0) * hourRate).toFixed(
                          2
                        )}{" "}
                        ج
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Section 7: Summary (Updated to support filters and points) */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>7. ملخص الساعات والنقاط</span>
            <FileText className="w-6 h-6 text-indigo-600" />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* UI Summary - (These are display elements, not inputs, so no label needed) */}
            {summaryRows.includes("ui") && (
              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 text-center">
                <p className="text-sm text-purple-700 font-semibold mb-1">
                  UI/UX
                </p>
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

            {/* Frontend Summary */}
            {summaryRows.includes("frontend") && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-700 font-semibold mb-1">
                  Frontend
                </p>
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

            {/* Backend Summary */}
            {summaryRows.includes("backend") && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
                <p className="text-sm text-green-700 font-semibold mb-1">
                  Backend
                </p>
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

            {/* Analysis Summary */}
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

            {/* Testing Summary */}
            {summaryRows.includes("testing") && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center">
                <p className="text-sm text-red-700 font-semibold mb-1">
                  Testing
                </p>
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

          {/* UPDATED: Total Project Summary (Unconditional, showing all 3 metrics) */}
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
          {/* END UPDATED */}
        </div>

        {/* Section 7.5: External Services - Conditional Display */}
        {showExternalServices && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>الخدمات الخارجية</span>
              <DollarSign className="w-6 h-6 text-cyan-600" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="domainCost"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  تكلفة الدومين (جنيه)
                </label>
                <input
                  id="domainCost"
                  type="number"
                  min="0"
                  value={domainCost}
                  onChange={handlePositiveInput(setDomainCost)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                  placeholder="500"
                  title="تكلفة شراء الدومين"
                />
              </div>
              <div>
                <label
                  htmlFor="serverCost"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  تكلفة السيرفر (جنيه)
                </label>
                <input
                  id="serverCost"
                  type="number"
                  min="0"
                  value={serverCost}
                  onChange={handlePositiveInput(setServerCost)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                  placeholder="2000"
                  title="تكلفة استضافة السيرفر السنوية/الشهرية"
                />
              </div>
            </div>
            <div className="mt-4 bg-cyan-50 border-2 border-cyan-300 rounded-lg p-4">
              <p className="font-bold text-cyan-900">
                إجمالي الخدمات الخارجية:{" "}
                <span className="text-2xl">
                  {(
                    (parseFloat(domainCost) || 0) +
                    (parseFloat(serverCost) || 0)
                  ).toFixed(2)}{" "}
                  ج
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Section 8: Final Cost - Conditional Display for Profit */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-6 mb-6 text-white">
          <h2 className="text-2xl font-bold mb-4">
            {showProfit
              ? "8. التكلفة النهائية والربح"
              : "8. إجمالي تكلفة المشروع"}
          </h2>
          <div className="space-y-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-lg">التكلفة الأساسية للمشروع</p>
              <p className="text-3xl font-bold">{projectCost.toFixed(2)} ج</p>
              {showExternalServices && (
                <p className="text-sm text-white/70 mt-1">
                  (شاملة الخدمات الخارجية)
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
                    <p className="text-sm font-semibold mb-2">
                      مبلغ الـ Profit
                    </p>
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

        {/* Export Button */}
        <button
          onClick={exportToPDF}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
        >
          <Download className="w-6 h-6" /> تصدير إلى PDF
        </button>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .max-w-6xl, .max-w-6xl * { visibility: visible; }
          .max-w-6xl { position: absolute; left: 0; top: 0; width: 100%; }
          button { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ProjectBudget;
