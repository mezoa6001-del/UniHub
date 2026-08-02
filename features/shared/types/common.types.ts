export type EntityId = string;

export interface SelectOption<T = string> {
  label: string;
  value: T;
}