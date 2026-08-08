import {
  collection,
  doc,
  increment,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./config";

export const col = (name: string) => collection(db, name);

export const dref = (path: string, id: string) =>
  doc(db, path, id);

export const ts = () => serverTimestamp();

export const inc = (value: number) => increment(value);

export { db };