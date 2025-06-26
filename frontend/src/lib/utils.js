import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const BASE_URL = import.meta.env.VITE_BASE_URL;
export default BASE_URL;

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
