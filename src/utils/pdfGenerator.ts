// utils/pdfGenerator.ts
import type {
  BasePage,
  ManualTotals,
  PricingType,
  ProjectPage,
  ProjectType,
  Totals,
} from "../types";

interface PDFGeneratorProps {
  pricingType: PricingType;
  projectType: ProjectType;
  hourRate: number;
  pointCost: number;
  basePage: BasePage;
  projectPages: ProjectPage[];
  manualTotals: ManualTotals;
  totals: Totals;
  summaryRows: string[];
  hoursPerDay: string;
  totalProjectHours: number;
  totalProjectPoints: number;
  totalProjectDays: number;
  domainCost: string;
  serverCost: string;
  projectCost: number;
  profitPercentage: string;
  finalCost: number;
  showProfit: boolean;
  showExternalServices: boolean;
}

export const generatePDF = (props: PDFGeneratorProps) => {
  const {
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
  } = props;

  const isTotalMode = pricingType === "total";
  const showProfitPDF = isTotalMode;
  const showExternalServicesPDF = pricingType === "backend" || isTotalMode;

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

      ${
        !isTotalMode
          ? `
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">تفصيل التكلفة الإجمالية</h2>
        <table style="width: 100%; border-collapse: collapse; text-align: center;">
          <thead style="background: #f1f5f9;">
            <tr>
              <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">البند</th>
              <th style="padding: 10px; border: 1px solid #e2e8f0;">التكلفة (جنيه)</th>
            </tr>
          </thead>
          <tbody>
            ${
              pricingType === "frontend"
                ? `
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right; font-weight: 600;">تكلفة Frontend</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">${(
                pointCost +
                projectPages.reduce(
                  (sum, page) =>
                    sum + (parseFloat(page.points) || 0) * pointCost,
                  0
                )
              ).toFixed(2)} ج</td>
            </tr>
            `
                : ""
            }
            ${
              pricingType === "backend"
                ? `
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right; font-weight: 600;">تكلفة Backend</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">${(
                pointCost +
                projectPages.reduce(
                  (sum, page) =>
                    sum + (parseFloat(page.points) || 0) * pointCost,
                  0
                )
              ).toFixed(2)} ج</td>
            </tr>
            `
                : ""
            }
            ${
              pricingType === "ui/ux"
                ? `
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right; font-weight: 600;">تكلفة UI/UX</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">${(
                pointCost +
                projectPages.reduce(
                  (sum, page) =>
                    sum + (parseFloat(page.points) || 0) * pointCost,
                  0
                )
              ).toFixed(2)} ج</td>
            </tr>
            `
                : ""
            }
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">تكلفة Analysis</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${(
                (parseFloat(totals.totalAnalysis.toString()) || 0) * hourRate
              ).toFixed(2)} ج</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">تكلفة Testing</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${(
                (parseFloat(totals.totalTesting.toString()) || 0) * hourRate
              ).toFixed(2)} ج</td>
            </tr>
            ${
              showExternalServicesPDF
                ? `
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">تكلفة الدومين</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${(
                parseFloat(domainCost) || 0
              ).toFixed(2)} ج</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">تكلفة السيرفر</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${(
                parseFloat(serverCost) || 0
              ).toFixed(2)} ج</td>
            </tr>
            `
                : ""
            }
            <tr style="background: #dbeafe; font-weight: 700;">
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: right; color: #1e40af; font-size: 16px;">الإجمالي</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; color: #1e40af; font-size: 16px;">${projectCost.toFixed(
                2
              )} ج</td>
            </tr>
          </tbody>
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
