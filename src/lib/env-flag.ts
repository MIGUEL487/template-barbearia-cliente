export function envFlag(value: string | undefined): boolean {
  return ['true', '1'].includes(value?.trim().toLowerCase() || '');
}
