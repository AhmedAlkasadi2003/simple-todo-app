export type Language = "en" | "ar";
export type Direction = "ltr" | "rtl";

export interface TranslationDictionary {
  app: {
    title: string;
    subtitle: string;
    dashboardTitle: string;
    dashboardSubtitle: string;
    newTask: string;
    returnHome: string;
    backToDashboard: string;
    pageNotFound: string;
    pageNotFoundDesc: string;
    somethingWentWrong: string;
    tryAgain: string;
    loading: string;
  };
  mode: {
    mockMode: string;
    liveApi: string;
    localStorageDesc: string;
    currentMode: string;
    mockAdapterDesc: string;
    switchModeHint: string;
  };
  stats: {
    totalTasks: string;
    allCreated: string;
    pending: string;
    needsAction: string;
    completed: string;
    percentDone: string;
    progressAriaLabel: string;
  };
  controls: {
    searchPlaceholder: string;
    clearSearch: string;
    sortByAria: string;
    sortNewest: string;
    sortOldest: string;
    sortTitleAZ: string;
    sortTitleZA: string;
    statusLabel: string;
    all: string;
    filterByAll: string;
    filterByPending: string;
    filterByCompleted: string;
  };
  card: {
    markAs: string;
    markCompleted: string;
    markPending: string;
    createdAt: string;
    updatedAt: string;
    idLabel: string;
    editTask: string;
    deleteTask: string;
  };
  list: {
    noTasksYet: string;
    noTasksYetDesc: string;
    createFirstTask: string;
    noMatchingTasks: string;
    noMatchingSearch: string;
    noMatchingStatus: string;
    resetFilters: string;
    loadingAria: string;
    feedAria: string;
  };
  form: {
    createTitle: string;
    createSubtitle: string;
    editTitle: string;
    editSubtitle: string;
    titleLabel: string;
    titlePlaceholder: string;
    titleHint: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    descriptionHint: string;
    cancel: string;
    createSubmit: string;
    saveSubmit: string;
    validationTitleRequired: string;
    validationTitleMin: string;
    validationTitleMax: string;
    validationDescMax: string;
  };
  deleteDialog: {
    title: string;
    confirmQuestion: string;
    warningDesc: string;
    cancel: string;
    deleteButton: string;
  };
  details: {
    backToList: string;
    markPending: string;
    markComplete: string;
    descriptionHeading: string;
    noDescription: string;
    createdAtHeading: string;
    lastUpdatedHeading: string;
    editAction: string;
    deleteAction: string;
    notFoundTitle: string;
    notFoundDesc: string;
    returnToList: string;
  };
  footer: {
    title: string;
    subtitle: string;
  };
  badges: {
    pending: string;
    completed: string;
    mock: string;
    api: string;
  };
}
