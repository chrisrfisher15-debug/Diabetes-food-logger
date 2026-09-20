export type FoodItem = {
  id: string;
  name: string;
  /** Optional carbohydrate amount entered by the user, in grams. */
  carbsGrams?: number;
};

export type MealLog = {
  id: string;
  /** Meal name or free-text notes. */
  name: string;
  foods: FoodItem[];
  /** Insulin units the user recorded. Never calculated by the app. */
  insulinUnits: number;
  /** Optional fingerstick / meter reading, mg/dL. */
  bloodGlucoseMgDl?: number;
  /** When the meal / dose happened (ISO 8601). */
  timestamp: string;
  createdAt: string;
  updatedAt: string;
};

export type FoodDraft = {
  id: string;
  name: string;
  carbsText: string;
};

export type MealLogDraft = {
  name: string;
  foods: FoodDraft[];
  insulinUnitsText: string;
  bloodGlucoseText: string;
  timestamp: Date;
};
