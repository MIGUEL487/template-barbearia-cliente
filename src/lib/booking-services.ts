export const hasServiceQuantities=(ids:string[])=>new Set(ids).size!==ids.length;
export const availabilityRpc=(ids:string[])=>hasServiceQuantities(ids)?'get_group_availability':'get_availability';
