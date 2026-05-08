import {
  fallbackResultsByLanguage,
  getScenarios,
  intensityByLanguage,
  practicePlansByLanguage,
} from './i18n';

export const scenarios = getScenarios('ru');
export const intensityOptions = intensityByLanguage.ru;
export const fallbackResults = fallbackResultsByLanguage.ru;
export const practicePlans = practicePlansByLanguage.ru;
