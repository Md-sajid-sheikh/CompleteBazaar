import { apiRequest } from '../api.js';

export async function adminRequest(path, token, options = {}) {
  return apiRequest(path, { ...options, token });
}

export function adminPageClass() {
  return 'mx-auto min-h-[55vh] w-[calc(100%-2rem)] max-w-[1120px] py-8 sm:w-[calc(100%-4rem)] sm:py-12';
}

export const inputClass = 'mt-2 min-h-11 w-full rounded-md border border-[#ded9cd] bg-white px-3 py-2 text-sm text-[#24271f] shadow-sm outline-none transition focus:border-[#3f5546] focus:ring-2 focus:ring-[#3f5546]/15';
export const labelClass = 'block text-sm font-medium text-[#50564d]';
export const buttonClass = 'inline-flex min-h-10 items-center justify-center rounded-md bg-[#405d47] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2f4936] disabled:cursor-not-allowed disabled:opacity-60';
export const secondaryButtonClass = 'inline-flex min-h-10 items-center justify-center rounded-md border border-[#ded9cd] bg-white px-4 py-2 text-sm font-medium text-[#50564d] transition hover:border-[#9ea892] hover:bg-[#f4f3ed]';
export const pageTitleClass = 'font-display text-3xl font-medium tracking-tight text-[#24271f] sm:text-4xl';
export const cardClass = 'rounded-xl border border-[#e5dfd3] bg-white p-5 shadow-sm sm:p-6';
