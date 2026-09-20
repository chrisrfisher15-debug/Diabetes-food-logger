import type { FoodDraft, FoodItem, MealLog, MealLogDraft } from './types';
import { createId } from './ids';

export type ValidationResult =
  | { ok: true; value: Omit<MealLog, 'id' | 'createdAt' | 'updatedAt'> }
  | { ok: false; message: string };

function parseRequiredNumber(value: string, label: string): { ok: true; value: number } | { ok: false; message: string } {
  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: false, message: `Enter ${label}. This app does not fill in or recommend a value.` };
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return { ok: false, message: `${label} must be a number.` };
  }

  return { ok: true, value: parsed };
}

function parseOptionalNumber(value: string, label: string): { ok: true; value?: number } | { ok: false; message: string } {
  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: true, value: undefined };
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return { ok: false, message: `${label} must be a number, or left blank.` };
  }

  return { ok: true, value: parsed };
}

export function createEmptyFood(): FoodDraft {
  return { id: createId('food'), name: '', carbsText: '' };
}

export function draftFromLog(log: MealLog): MealLogDraft {
  return {
    name: log.name,
    foods:
      log.foods.length > 0
        ? log.foods.map((food) => ({
            id: food.id,
            name: food.name,
            carbsText: food.carbsGrams == null ? '' : String(food.carbsGrams),
          }))
        : [createEmptyFood()],
    insulinUnitsText: String(log.insulinUnits),
    bloodGlucoseText: log.bloodGlucoseMgDl == null ? '' : String(log.bloodGlucoseMgDl),
    timestamp: new Date(log.timestamp),
  };
}

export function createEmptyDraft(now = new Date()): MealLogDraft {
  return {
    name: '',
    foods: [createEmptyFood()],
    insulinUnitsText: '',
    bloodGlucoseText: '',
    timestamp: now,
  };
}

export function validateDraft(draft: MealLogDraft): ValidationResult {
  const name = draft.name.trim();
  if (!name) {
    return { ok: false, message: 'Add a meal name or notes so you can find this log later.' };
  }

  const insulin = parseRequiredNumber(draft.insulinUnitsText, 'the insulin dose you took (units)');
  if (!insulin.ok) {
    return insulin;
  }
  if (insulin.value < 0) {
    return { ok: false, message: 'Insulin units cannot be negative.' };
  }
  if (insulin.value > 200) {
    return { ok: false, message: 'Insulin units look unusually high. Check the number you entered.' };
  }

  const glucose = parseOptionalNumber(draft.bloodGlucoseText, 'Blood glucose');
  if (!glucose.ok) {
    return glucose;
  }
  if (glucose.value != null && (glucose.value < 20 || glucose.value > 700)) {
    return { ok: false, message: 'Blood glucose should be between 20 and 700 mg/dL, or left blank.' };
  }

  if (Number.isNaN(draft.timestamp.getTime())) {
    return { ok: false, message: 'Enter a valid date and time.' };
  }

  const foods: FoodItem[] = [];
  for (const food of draft.foods) {
    const foodName = food.name.trim();
    const carbsText = food.carbsText.trim();
    if (!foodName && !carbsText) {
      continue;
    }
    if (!foodName) {
      return { ok: false, message: 'Each food needs a name. Remove empty food rows or add a name.' };
    }

    const carbs = parseOptionalNumber(carbsText, `Carbs for ${foodName}`);
    if (!carbs.ok) {
      return carbs;
    }
    if (carbs.value != null && carbs.value < 0) {
      return { ok: false, message: `Carbs for ${foodName} cannot be negative.` };
    }

    foods.push({
      id: food.id,
      name: foodName,
      carbsGrams: carbs.value,
    });
  }

  return {
    ok: true,
    value: {
      name,
      foods,
      insulinUnits: insulin.value,
      bloodGlucoseMgDl: glucose.value,
      timestamp: draft.timestamp.toISOString(),
    },
  };
}

export function isMealLog(value: unknown): value is MealLog {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const log = value as MealLog;
  return (
    typeof log.id === 'string' &&
    typeof log.name === 'string' &&
    Array.isArray(log.foods) &&
    typeof log.insulinUnits === 'number' &&
    Number.isFinite(log.insulinUnits) &&
    typeof log.timestamp === 'string' &&
    typeof log.createdAt === 'string' &&
    typeof log.updatedAt === 'string'
  );
}
