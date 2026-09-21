import * as XLSX from "xlsx";

export function downloadProductTemplate(categories = []) {
  const headers = [
    "name",
    "price",
    "oldPrice",
    "stock",
    "categories",
    "description",
    "usage",
    "ingredients",
    "seoTitle",
    "seoDescription",
    "seoSlug",
    "images",
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([
    headers,
    ["", "", "", "", "اختر من القائمة", "", "", "", "", "", "", ""],
  ]);

  // إنشاء قائمة التصنيفات
  const categorySheet = XLSX.utils.aoa_to_sheet([
    ["Categories"],
    ...categories.map((category) => [category.name]),
  ]);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  XLSX.utils.book_append_sheet(workbook, categorySheet, "Categories");

  // جعل ورقة التصنيفات مخفية
  workbook.Workbook = workbook.Workbook || {};
  workbook.Workbook.Sheets = workbook.Workbook.Sheets || [];

  workbook.Workbook.Sheets[1] = {
    Hidden: 1,
  };

  // إضافة قائمة اختيار للتصنيف
  worksheet["!dataValidation"] = [
    {
      sqref: "E2:E1000",
      type: "list",
      formula1: "Categories!$A$2:$A$100",
      allowBlank: true,
    },
  ];

  XLSX.writeFile(workbook, "sahra-products-template.xlsx");
}
