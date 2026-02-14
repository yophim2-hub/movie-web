/**
 * Module Admin Pages — cấu hình trang (home, phim lẻ, ...), filter API, phim đã chọn.
 */

export { PageConfigEditor } from "./components";
export { useAdminPageConfigs } from "./hooks";
export type {
  AdminPageId,
  AdminPageIdAny,
  AdminPageConfig,
  AdminFilterSetting,
  AdminPageListItem,
  AdminCustomPageMeta,
} from "./interfaces";
export { ADMIN_PAGE_IDS, ADMIN_PAGE_LABELS, ADMIN_PAGE_SLUGS } from "./interfaces";
export {
  getAdminPageConfigs,
  getPageList,
  addCustomPage,
  updateCustomPage,
  removeCustomPage,
  setAdminPageFilter,
  addSavedMovie,
  removeSavedMovie,
} from "./store";
