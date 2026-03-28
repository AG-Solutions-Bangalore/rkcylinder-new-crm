export const LOGIN = {
  postLogin: "web-login",
  forgotpassword: "web-send-password",
};
export const PANEL_CHECK = {
  getPanelStatus: "web-check-status",
};

export const DASHBOARD = {
  list: "/dashboard",
};
export const VENDOR_API = {
  list: "web-fetch-vendor-list",
  dropdown: "web-fetch-vendor",
  create: "web-create-vendor",
  byId: (id) => `web-fetch-vendor-by-id/${id}`,
  updateById: (id) => `web-update-vendor/${id}`,
};
export const MANUFACTURER_API = {
  list: "web-fetch-manufacturer-list",
  dropdown: "web-fetch-manufacturer",
  create: "web-create-manufacturer",
  byId: (id) => `web-fetch-manufacturer-by-id/${id}`,
  updateById: (id) => `web-update-manufacturer/${id}`,
};

export const CYLINDER_API = {
  list: "web-fetch-cylinder-list",
  batchNo: "web-fetch-batch-no",
  create: "web-create-cylinder",
  updateSub: (id) => `web-update-cylinder-new/${id}`,
  byId: (id) => `web-fetch-cylinder-by-id/${id}`,
  detailsByBarcode: (barcode) => `web-fetch-cylinder-details-by-barcode/${barcode}`,
};

export const REPORT_API = {
  vendor: "fetch-vendor-report",
  manufacturer: "fetch-manufacturer-report",
  report1: "fetch-report1-report",
  report2: "fetch-report2-report",
  cylinderDetails: "fetch-cylinder-details-report",
  downloadReport1: "download-report1-report",
  downloadReport2: "download-report2-report",
  downloadCylinderDetails: "download-cylinder-details-report",
};

export const CHANGE_PASSWORD_API = {
  create: "web-change-password",
};
