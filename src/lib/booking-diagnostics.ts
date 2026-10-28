export type AvailabilityDiagnostic = {slots?: number; error?: {code?: string; message: string; details?: string; hint?: string}; parameters?: {p_barbershop_id: string; p_barber_id: string | null; p_date: string; p_service_ids: string[]}};
export function reportSupabaseError(operation: string, error: unknown) {
  const e = error as {code?: string; message?: string; details?: string; hint?: string};
  const detail = {code: e?.code, message: e?.message || String(error), details: e?.details, hint: e?.hint};
  console.error(`[Supabase] ${operation}`, detail);
  return detail;
}
export function reportAvailability(detail: AvailabilityDiagnostic) {
  window.dispatchEvent(new CustomEvent('booking-availability', {detail}));
}
