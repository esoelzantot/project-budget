import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Download,
  Calculator,
  DollarSign,
  Clock,
  FileText,
} from "lucide-react";

const ProjectBudget = () => {
  // Section 1: Hour Rate Calculation
  const [salary, setSalary] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [calculationFactor, setCalculationFactor] = useState("1.5");
  // Section 2 & 3: Project Type & Pricing Type
  const [projectType, setProjectType] = useState("web");
  const [pricingType, setPricingType] = useState("total");

  // Section 4: Base Page
  const [basePage, setBasePage] = useState({
    name: "Base Page",
    uiHours: "",
    frontendHours: "",
    backendHours: "",
    points: 1,
  });

  // Section 5: Project Pages
  const [projectPages, setProjectPages] = useState([
    {
      id: 1,
      name: "",
      uiHours: "",
      frontendHours: "",
      backendHours: "",
      points: "",
    },
  ]);

  // Section 6: Analysis & Testing
  const [analysisHours, setAnalysisHours] = useState("");
  const [testingHours, setTestingHours] = useState("");

  // Section 7.5: External Services
  const [domainCost, setDomainCost] = useState("");
  const [serverCost, setServerCost] = useState("");

  // Section 8: Profit
  const [profitPercentage, setProfitPercentage] = useState("");

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

  // Calculate point cost from base page
  const pointCost = React.useMemo(() => {
    let totalHours = 0;
    if (pricingType === "total") {
      totalHours =
        (parseFloat(basePage.uiHours) || 0) +
        (parseFloat(basePage.frontendHours) || 0) +
        (parseFloat(basePage.backendHours) || 0);
    } else if (pricingType === "frontend") {
      totalHours = parseFloat(basePage.frontendHours) || 0;
    } else if (pricingType === "backend") {
      totalHours = parseFloat(basePage.backendHours) || 0;
    } else if (pricingType === "ui/ux") {
      totalHours = parseFloat(basePage.uiHours) || 0;
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
      },
    ]);
  };

  // Remove project page
  const removeProjectPage = (id: number) => {
    setProjectPages(projectPages.filter((page) => page.id !== id));
  };

  // Update project page
  const updateProjectPage = (id: number, field: string, value: string) => {
    setProjectPages(
      projectPages.map((page) =>
        page.id === id ? { ...page, [field]: value } : page
      )
    );
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalUI = parseFloat(basePage.uiHours) || 0;
    let totalFrontend = parseFloat(basePage.frontendHours) || 0;
    let totalBackend = parseFloat(basePage.backendHours) || 0;

    projectPages.forEach((page) => {
      totalUI += parseFloat(page.uiHours) || 0;
      totalFrontend += parseFloat(page.frontendHours) || 0;
      totalBackend += parseFloat(page.backendHours) || 0;
    });

    const totalAnalysis = parseFloat(analysisHours) || 0;
    const totalTesting = parseFloat(testingHours) || 0;

    return {
      totalUI,
      totalFrontend,
      totalBackend,
      totalAnalysis,
      totalTesting,
    };
  };

  const totals = calculateTotals();

  // Calculate project cost
  const calculateProjectCost = () => {
    let pageCost = pointCost; // Base page cost

    projectPages.forEach((page) => {
      const points = parseFloat(page.points) || 0;
      pageCost += points * pointCost;
    });

    const analysisCost = (parseFloat(analysisHours) || 0) * hourRate;
    const testingCost = (parseFloat(testingHours) || 0) * hourRate;
    const externalServices =
      (parseFloat(domainCost) || 0) + (parseFloat(serverCost) || 0);

    return pageCost + analysisCost + testingCost + externalServices;
  };

  const projectCost = calculateProjectCost();
  const profitAmount =
    (projectCost * (parseFloat(profitPercentage) || 0)) / 100;
  const finalCost = projectCost + profitAmount;

  // Get visible fields based on pricing type
  const getVisibleFields = () => {
    switch (pricingType) {
      case "frontend":
        return ["frontend"];
      case "backend":
        return ["backend"];
      case "ui/ux":
        return ["ui"];
      case "analysis":
        return ["analysis"];
      case "testing":
        return ["testing"];
      case "total":
        return ["ui", "frontend", "backend"];
      default:
        return ["ui", "frontend", "backend"];
    }
  };

  const visibleFields = getVisibleFields();

  // Export to PDF function
  const exportToPDF = () => {
    // Validation
    if (!salary || !hoursPerDay) {
      alert("⚠️ من فضلك أدخل البيانات الأساسية أولاً (الراتب وعدد الساعات)");
      return;
    }

    // Create PDF content as HTML string
    const pdfContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 210mm; margin: 0 auto; padding: 20mm; background: white; color: #000; direction: rtl;">
        
        <!-- Letterhead / Header -->
        <div style="border-bottom: 4px solid #1e40af; padding-bottom: 15px; margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h1 style="margin: 0; font-size: 28px; color: #1e40af; font-weight: 700;">تقرير تكلفة المشروع</h1>
              <p style="margin: 5px 0 0 0; color: #64748b; font-size: 13px;">Project Cost Estimation Report</p>
            </div>
            <div style="text-align: left;">
              <div style="font-size: 11px; color: #64748b; line-height: 1.6;">
                <div><strong>التاريخ:</strong> ${new Date().toLocaleDateString(
                  "ar-EG",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}</div>     
              </div>
            </div>
          </div>
        </div>

        <!-- Project Summary Box -->
        <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-right: 6px solid #1e40af; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
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
          </table>
        </div>

        <!-- Base Page Section -->
        <div style="margin-bottom: 30px;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">الصفحة الأساسية (Base Page)</h2>
          
          <div style="background: #f1f5f9; padding: 12px 15px; border-right: 4px solid #3b82f6; margin-bottom: 12px;">
            <h3 style="margin: 0; font-size: 16px; color: #1e293b; font-weight: 600;">${
              basePage.name
            }</h3>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
            ${
              visibleFields.includes("ui")
                ? `
            <tr>
              <td style="padding: 10px 15px; width: 30%; background: #f8fafc; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">ساعات UI:</td>
              <td style="padding: 10px 15px; background: white; border: 1px solid #e2e8f0;">${
                basePage.uiHours || 0
              } ساعة</td>
            </tr>`
                : ""
            }
            ${
              visibleFields.includes("frontend")
                ? `
            <tr>
              <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">ساعات Frontend:</td>
              <td style="padding: 10px 15px; background: white; border: 1px solid #e2e8f0;">${
                basePage.frontendHours || 0
              } ساعة</td>
            </tr>`
                : ""
            }
            ${
              visibleFields.includes("backend")
                ? `
            <tr>
              <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">ساعات Backend:</td>
              <td style="padding: 10px 15px; background: white; border: 1px solid #e2e8f0;">${
                basePage.backendHours || 0
              } ساعة</td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">عدد الـ Points:</td>
              <td style="padding: 10px 15px; background: white; border: 1px solid #e2e8f0; font-weight: 600;">1</td>
            </tr>
          </table>
        </div>

        <!-- Project Pages Section -->
        ${
          projectPages.length > 0 && projectPages[0].name
            ? `
        <div style="margin-bottom: 30px;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">صفحات المشروع</h2>
          
          ${projectPages
            .map(
              (page, index) => `
            <div style="margin-bottom: 25px; page-break-inside: avoid;">
              <div style="background: #f1f5f9; padding: 12px 15px; border-right: 4px solid #3b82f6; margin-bottom: 12px;">
                <h3 style="margin: 0; font-size: 16px; color: #1e293b; font-weight: 600;">
                  ${index + 1}. ${page.name || `صفحة ${index + 1}`}
                </h3>
              </div>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                ${
                  visibleFields.includes("ui")
                    ? `
                <tr>
                  <td style="padding: 10px 15px; width: 30%; background: #f8fafc; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">ساعات UI:</td>
                  <td style="padding: 10px 15px; background: white; border: 1px solid #e2e8f0;">${
                    page.uiHours || 0
                  } ساعة</td>
                </tr>`
                    : ""
                }
                ${
                  visibleFields.includes("frontend")
                    ? `
                <tr>
                  <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">ساعات Frontend:</td>
                  <td style="padding: 10px 15px; background: white; border: 1px solid #e2e8f0;">${
                    page.frontendHours || 0
                  } ساعة</td>
                </tr>`
                    : ""
                }
                ${
                  visibleFields.includes("backend")
                    ? `
                <tr>
                  <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">ساعات Backend:</td>
                  <td style="padding: 10px 15px; background: white; border: 1px solid #e2e8f0;">${
                    page.backendHours || 0
                  } ساعة</td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">عدد الـ Points:</td>
                  <td style="padding: 10px 15px; background: white; border: 1px solid #e2e8f0; font-weight: 600;">${
                    page.points || 0
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">التكلفة:</td>
                  <td style="padding: 10px 15px; background: #dcfce7; border: 1px solid #e2e8f0; font-weight: 600; color: #16a34a;">${(
                    (parseFloat(page.points) || 0) * pointCost
                  ).toFixed(2)} جنيه</td>
                </tr>
              </table>
            </div>
          `
            )
            .join("")}
        </div>`
            : ""
        }

        <!-- Hours Summary Section -->
        <div style="margin-bottom: 30px; page-break-inside: avoid;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">ملخص الساعات والأيام</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #1e40af; color: white;">
                <th style="padding: 12px; text-align: right; border: 1px solid #1e40af;">القسم</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #1e40af;">عدد الساعات</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #1e40af;">عدد الأيام</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">UI/UX</td>
                <td style="padding: 10px 15px; background: white; text-align: center; border: 1px solid #e2e8f0;">${
                  totals.totalUI
                }</td>
                <td style="padding: 10px 15px; background: white; text-align: center; border: 1px solid #e2e8f0;">${
                  hoursPerDay
                    ? Math.ceil(totals.totalUI / parseFloat(hoursPerDay))
                    : 0
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Frontend</td>
                <td style="padding: 10px 15px; background: white; text-align: center; border: 1px solid #e2e8f0;">${
                  totals.totalFrontend
                }</td>
                <td style="padding: 10px 15px; background: white; text-align: center; border: 1px solid #e2e8f0;">${
                  hoursPerDay
                    ? Math.ceil(totals.totalFrontend / parseFloat(hoursPerDay))
                    : 0
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Backend</td>
                <td style="padding: 10px 15px; background: white; text-align: center; border: 1px solid #e2e8f0;">${
                  totals.totalBackend
                }</td>
                <td style="padding: 10px 15px; background: white; text-align: center; border: 1px solid #e2e8f0;">${
                  hoursPerDay
                    ? Math.ceil(totals.totalBackend / parseFloat(hoursPerDay))
                    : 0
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Analysis</td>
                <td style="padding: 10px 15px; background: white; text-align: center; border: 1px solid #e2e8f0;">${
                  totals.totalAnalysis
                }</td>
                <td style="padding: 10px 15px; background: white; text-align: center; border: 1px solid #e2e8f0;">${
                  hoursPerDay
                    ? Math.ceil(totals.totalAnalysis / parseFloat(hoursPerDay))
                    : 0
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px 15px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Testing</td>
                <td style="padding: 10px 15px; background: white; text-align: center; border: 1px solid #e2e8f0;">${
                  totals.totalTesting
                }</td>
                <td style="padding: 10px 15px; background: white; text-align: center; border: 1px solid #e2e8f0;">${
                  hoursPerDay
                    ? Math.ceil(totals.totalTesting / parseFloat(hoursPerDay))
                    : 0
                }</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Cost Breakdown Section -->
        <div style="margin-bottom: 30px; page-break-inside: avoid;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">تفصيل التكاليف</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 15px; background: #f8fafc; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">تكلفة Analysis:</td>
              <td style="padding: 12px 15px; background: white; border: 1px solid #e2e8f0; text-align: left; font-weight: 600;">${(
                (parseFloat(analysisHours) || 0) * hourRate
              ).toFixed(2)} جنيه</td>
            </tr>
            <tr>
              <td style="padding: 12px 15px; background: #f8fafc; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">تكلفة Testing:</td>
              <td style="padding: 12px 15px; background: white; border: 1px solid #e2e8f0; text-align: left; font-weight: 600;">${(
                (parseFloat(testingHours) || 0) * hourRate
              ).toFixed(2)} جنيه</td>
            </tr>
            <tr>
              <td style="padding: 12px 15px; background: #f8fafc; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">تكلفة الدومين:</td>
              <td style="padding: 12px 15px; background: white; border: 1px solid #e2e8f0; text-align: left; font-weight: 600;">${(
                parseFloat(domainCost) || 0
              ).toFixed(2)} جنيه</td>
            </tr>
            <tr>
              <td style="padding: 12px 15px; background: #f8fafc; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">تكلفة السيرفر:</td>
              <td style="padding: 12px 15px; background: white; border: 1px solid #e2e8f0; text-align: left; font-weight: 600;">${(
                parseFloat(serverCost) || 0
              ).toFixed(2)} جنيه</td>
            </tr>
            <tr style="background: #fef3c7; border-top: 2px solid #f59e0b;">
              <td style="padding: 12px 15px; font-weight: 700; color: #92400e; border: 1px solid #f59e0b;">إجمالي تكلفة المشروع:</td>
              <td style="padding: 12px 15px; border: 1px solid #f59e0b; text-align: left; font-weight: 700; color: #92400e; font-size: 18px;">${projectCost.toFixed(
                2
              )} جنيه</td>
            </tr>
            <tr>
              <td style="padding: 12px 15px; background: #f8fafc; font-weight: 600; color: #475569; border: 1px solid #e2e8f0;">نسبة الـ Profit (${
                profitPercentage || 0
              }%):</td>
              <td style="padding: 12px 15px; background: white; border: 1px solid #e2e8f0; text-align: left; font-weight: 600;">${Math.ceil(
                profitAmount
              )} جنيه</td>
            </tr>
            <tr style="background: #dcfce7; border-top: 3px solid #16a34a;">
              <td style="padding: 15px; font-weight: 700; color: #166534; border: 2px solid #16a34a; font-size: 16px;">التكلفة النهائية (مع الربح):</td>
              <td style="padding: 15px; border: 2px solid #16a34a; text-align: left; font-weight: 700; color: #166534; font-size: 20px;">${finalCost.toFixed(
                2
              )} جنيه</td>
            </tr>
          </table>
        </div>

        <!-- Footer / Signature Section -->
        <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
          <table style="width: 100%; margin-top: 30px;">
            <tr>
              <td style="width: 50%; text-align: center; padding: 20px 0;">
                <div style="border-top: 2px solid #1e293b; width: 200px; margin: 0 auto; padding-top: 8px;">
                  <div style="font-weight: 600; color: #475569;">التوقيع</div>
                </div>
              </td>
              <td style="width: 50%; text-align: center; padding: 20px 0;">
                <div style="border-top: 2px solid #1e293b; width: 200px; margin: 0 auto; padding-top: 8px;">
                  <div style="font-weight: 600; color: #475569;">التاريخ</div>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Document Footer -->
        <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          <p style="margin: 0;">هذا المستند تم إنشاؤه تلقائياً بواسطة نظام تحديد تكلفة المشاريع</p>
          <p style="margin: 5px 0 0 0;">Professional Project Cost Estimation System</p>
        </div>
      </div>
    `;

    // Create a new window with the PDF content
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>تقرير تكلفة المشروع - ${projectType.toUpperCase()}</title>
          <style>
            * { box-sizing: border-box; }
            body { 
              margin: 0; 
              padding: 20px;
              background: #f5f5f5;
            }
            @media print {
              body { 
                margin: 0; 
                padding: 0;
                background: white;
              }
              @page { 
                size: A4;
                margin: 15mm;
              }
            }
          </style>
        </head>
        <body>
          ${pdfContent}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
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
                htmlFor="salary"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                الراتب (جنيه)
              </label>
              <input
                id="salary"
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="مثال: 10000"
                aria-label="الراتب بالجنيه"
              />
            </div>
            <div>
              <label
                htmlFor="hoursPerDay"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                عدد الساعات (يومياً)
              </label>
              <input
                id="hoursPerDay"
                type="number"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="مثال: 8"
                aria-label="عدد الساعات يومياً"
              />
            </div>
            <div>
              <label
                htmlFor="calculationFactor"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                عامل الحسبة
              </label>
              <input
                id="calculationFactor"
                type="number"
                step="0.1"
                value={calculationFactor}
                onChange={(e) => setCalculationFactor(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="مثال: 1.5"
                aria-label="عامل الحسبة"
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

        {/* Section 2 & 3: Project Type & Pricing Type */}
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
            <div className="grid grid-cols-3 gap-3">
              {[
                "frontend",
                "backend",
                "ui/ux",
                "analysis",
                "testing",
                "total",
              ].map((type) => (
                <button
                  key={type}
                  onClick={() => setPricingType(type)}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all text-sm ${
                    pricingType === type
                      ? "bg-purple-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type === "ui/ux" ? "UI/UX" : type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Base Page */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            4. الصفحة الأساسية (Base Page)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="md:col-span-1">
              <label
                htmlFor="basePage-name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                اسم الصفحة
              </label>
              <input
                id="basePage-name"
                type="text"
                value={basePage.name}
                onChange={(e) =>
                  setBasePage({ ...basePage, name: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Base Page"
                aria-label="اسم الصفحة الأساسية"
              />
            </div>
            {visibleFields.includes("ui") && (
              <div>
                <label
                  htmlFor="basePage-ui"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  ساعات UI
                </label>
                <input
                  id="basePage-ui"
                  type="number"
                  value={basePage.uiHours}
                  onChange={(e) =>
                    setBasePage({ ...basePage, uiHours: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="0"
                  aria-label="ساعات UI للصفحة الأساسية"
                />
              </div>
            )}
            {visibleFields.includes("frontend") && (
              <div>
                <label
                  htmlFor="basePage-frontend"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  ساعات Frontend
                </label>
                <input
                  id="basePage-frontend"
                  type="number"
                  value={basePage.frontendHours}
                  onChange={(e) =>
                    setBasePage({ ...basePage, frontendHours: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="0"
                  aria-label="ساعات Frontend للصفحة الأساسية"
                />
              </div>
            )}
            {visibleFields.includes("backend") && (
              <div>
                <label
                  htmlFor="basePage-backend"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  ساعات Backend
                </label>
                <input
                  id="basePage-backend"
                  type="number"
                  value={basePage.backendHours}
                  onChange={(e) =>
                    setBasePage({ ...basePage, backendHours: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="0"
                  aria-label="ساعات Backend للصفحة الأساسية"
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
                  <h3 className="font-bold text-gray-700">صفحة {index + 1}</h3>
                  <button
                    onClick={() => removeProjectPage(page.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    aria-label={`حذف الصفحة ${index + 1}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label
                      htmlFor={`page-name-${page.id}`}
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      اسم الصفحة
                    </label>
                    <input
                      id={`page-name-${page.id}`}
                      type="text"
                      value={page.name}
                      onChange={(e) =>
                        updateProjectPage(page.id, "name", e.target.value)
                      }
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder={`صفحة ${index + 1}`}
                      aria-label={`اسم الصفحة ${index + 1}`}
                    />
                  </div>
                  {visibleFields.includes("ui") && (
                    <div>
                      <label
                        htmlFor={`page-ui-${page.id}`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        ساعات UI
                      </label>
                      <input
                        id={`page-ui-${page.id}`}
                        type="number"
                        value={page.uiHours}
                        onChange={(e) =>
                          updateProjectPage(page.id, "uiHours", e.target.value)
                        }
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="0"
                        aria-label={`ساعات UI للصفحة ${index + 1}`}
                      />
                    </div>
                  )}
                  {visibleFields.includes("frontend") && (
                    <div>
                      <label
                        htmlFor={`page-frontend-${page.id}`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        ساعات Frontend
                      </label>
                      <input
                        id={`page-frontend-${page.id}`}
                        type="number"
                        value={page.frontendHours}
                        onChange={(e) =>
                          updateProjectPage(
                            page.id,
                            "frontendHours",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="0"
                        aria-label={`ساعات Frontend للصفحة ${index + 1}`}
                      />
                    </div>
                  )}
                  {visibleFields.includes("backend") && (
                    <div>
                      <label
                        htmlFor={`page-backend-${page.id}`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        ساعات Backend
                      </label>
                      <input
                        id={`page-backend-${page.id}`}
                        type="number"
                        value={page.backendHours}
                        onChange={(e) =>
                          updateProjectPage(
                            page.id,
                            "backendHours",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="0"
                        aria-label={`ساعات Backend للصفحة ${index + 1}`}
                      />
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor={`page-points-${page.id}`}
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      عدد الـ Points
                    </label>
                    <input
                      id={`page-points-${page.id}`}
                      type="number"
                      value={page.points}
                      onChange={(e) =>
                        updateProjectPage(page.id, "points", e.target.value)
                      }
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="0"
                      aria-label={`عدد Points للصفحة ${index + 1}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      التكلفة
                    </label>
                    <div className="w-full px-4 py-2 bg-green-50 border-2 border-green-300 rounded-lg text-green-700 font-bold">
                      {((parseFloat(page.points) || 0) * pointCost).toFixed(2)}{" "}
                      ج
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addProjectPage}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            إضافة صفحة جديدة
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
                value={analysisHours}
                onChange={(e) => setAnalysisHours(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="مثال: 20"
                aria-label="ساعات Analysis"
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
                value={testingHours}
                onChange={(e) => setTestingHours(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="مثال: 15"
                aria-label="ساعات Testing"
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

        {/* Section 7: Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>7. ملخص الساعات</span>
            <FileText className="w-6 h-6 text-indigo-600" />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 text-center">
              <p className="text-sm text-purple-700 font-semibold mb-1">
                UI/UX
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {totals.totalUI}
              </p>
              <p className="text-xs text-purple-600">ساعة</p>
              <p className="text-lg font-bold text-purple-800 mt-2">
                {hoursPerDay
                  ? Math.ceil(totals.totalUI / parseFloat(hoursPerDay))
                  : "0"}{" "}
                يوم
              </p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-700 font-semibold mb-1">
                Frontend
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {totals.totalFrontend}
              </p>
              <p className="text-xs text-blue-600">ساعة</p>
              <p className="text-lg font-bold text-blue-800 mt-2">
                {hoursPerDay
                  ? Math.ceil(totals.totalFrontend / parseFloat(hoursPerDay))
                  : "0"}{" "}
                يوم
              </p>
            </div>
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
              <p className="text-sm text-green-700 font-semibold mb-1">
                Backend
              </p>
              <p className="text-2xl font-bold text-green-900">
                {totals.totalBackend}
              </p>
              <p className="text-xs text-green-600">ساعة</p>
              <p className="text-lg font-bold text-green-800 mt-2">
                {hoursPerDay
                  ? Math.ceil(totals.totalBackend / parseFloat(hoursPerDay))
                  : "0"}{" "}
                يوم
              </p>
            </div>
            <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 text-center">
              <p className="text-sm text-orange-700 font-semibold mb-1">
                Analysis
              </p>
              <p className="text-2xl font-bold text-orange-900">
                {totals.totalAnalysis}
              </p>
              <p className="text-xs text-orange-600">ساعة</p>
              <p className="text-lg font-bold text-orange-800 mt-2">
                {hoursPerDay
                  ? Math.ceil(totals.totalAnalysis / parseFloat(hoursPerDay))
                  : "0"}{" "}
                يوم
              </p>
            </div>
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center">
              <p className="text-sm text-red-700 font-semibold mb-1">Testing</p>
              <p className="text-2xl font-bold text-red-900">
                {totals.totalTesting}
              </p>
              <p className="text-xs text-red-600">ساعة</p>
              <p className="text-lg font-bold text-red-800 mt-2">
                {hoursPerDay
                  ? Math.ceil(totals.totalTesting / parseFloat(hoursPerDay))
                  : "0"}{" "}
                يوم
              </p>
            </div>
          </div>
        </div>

        {/* Section 7.5: External Services */}
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
                value={domainCost}
                onChange={(e) => setDomainCost(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                placeholder="مثال: 500"
                aria-label="تكلفة الدومين"
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
                value={serverCost}
                onChange={(e) => setServerCost(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                placeholder="مثال: 2000"
                aria-label="تكلفة السيرفر"
              />
            </div>
          </div>
          <div className="mt-4 bg-cyan-50 border-2 border-cyan-300 rounded-lg p-4">
            <p className="font-bold text-cyan-900">
              إجمالي الخدمات الخارجية:{" "}
              <span className="text-2xl">
                {(
                  (parseFloat(domainCost) || 0) + (parseFloat(serverCost) || 0)
                ).toFixed(2)}{" "}
                ج
              </span>
            </p>
          </div>
        </div>

        {/* Section 8: Final Cost */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-6 mb-6 text-white">
          <h2 className="text-2xl font-bold mb-4">8. التكلفة النهائية</h2>
          <div className="space-y-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-lg">إجمالي تكلفة المشروع</p>
              <p className="text-3xl font-bold">{projectCost.toFixed(2)} ج</p>
            </div>
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
                  value={profitPercentage}
                  onChange={(e) => setProfitPercentage(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-white/30 bg-white/10 rounded-lg focus:border-white focus:outline-none text-white placeholder-white/50"
                  placeholder="مثال: 20"
                  aria-label="نسبة الربح بالنسبة المئوية"
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
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={exportToPDF}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
        >
          <Download className="w-6 h-6" />
          تصدير إلى PDF
        </button>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .max-w-6xl, .max-w-6xl * {
            visibility: visible;
          }
          .max-w-6xl {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectBudget;
