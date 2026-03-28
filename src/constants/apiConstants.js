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
  list: "web-vendor-list",
  create: "web-create-vendor",
  byId: (id) => `web-fetch-vendor-by-id/${id}`,
  updateById: (id) => `web-update-vendor/${id}`,
};
export const MANUFACTURER_API = {
  list: "web-manufacturer-list",
  create: "web-create-manufacturer",
  byId: (id) => `web-fetch-manufacturer-by-id/${id}`,
  updateById: (id) => `web-update-manufacturer/${id}`,
};

export const CYLINDER_API = {
  list: "web-fetch-cylinder-list",
  batchNo: "web-fetch-batch-no",
  create: "web-create-cylinder", // Guessing create endpoint
  updateSub: (id) => `web-update-cylinder-new/${id}`,
  // We'll add sub-item list/fetch when discovered or needed
};

export const CHANGE_PASSWORD_API = {
  create: "web-change-password",
};
