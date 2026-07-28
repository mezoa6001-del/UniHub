import type { Timestamp } from "firebase/firestore";

/**
 * Every Firestore document has an id.
 */
export interface BaseEntity {
  id: string;
}

/**
 * Firestore timestamps shared across entities.
 */
export interface TimestampedEntity {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Base entity stored in Firestore.
 */
export interface FirestoreEntity
  extends BaseEntity,
    TimestampedEntity {}

/**
 * Entities that can be enabled/disabled.
 */
export interface ActivatableEntity {
  isActive: boolean;
}

/**
 * Entities that support custom ordering.
 */
export interface SortableEntity {
  sortOrder: number;
}

/**
 * Entities that support soft deletion.
 */
export interface SoftDeleteEntity {
  deletedAt?: Timestamp | null;
}