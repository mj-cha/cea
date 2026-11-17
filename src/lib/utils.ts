import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind CSS 클래스를 조건부로 결합하고 충돌하는 유틸리티 클래스를 병합한다. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
