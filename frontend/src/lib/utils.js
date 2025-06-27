import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const BASE_URL = import.meta.env.VITE_BASE_URL;
export default BASE_URL;

export const API_KEY_ADD = import.meta.env.VITE_API_KEY_ADD;
export const API_KEY_COOR = import.meta.env.VITE_API_KEY_COOR;
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
