export type RegionalProfile={version:1;slug:string;name:string;locale:'pt-br'|'en'|'es'|'fr-ca';currency:string;timezone:string;palette:Partial<Record<'primary'|'secondary'|'accent',string>>;websiteOrigin:string};
export const defaultRegion:RegionalProfile={version:1,slug:'',name:'Barbearia Modelo',locale:'pt-br',currency:'BRL',timezone:'America/Sao_Paulo',palette:{},websiteOrigin:''};
export function parseProfile(value:unknown,slug:string,websiteOrigin:string):RegionalProfile {
 if(!value||typeof value!=='object')throw new Error('Invalid regional profile');const v=value as Record<string,unknown>;
 if(v.version!==1||v.slug!==slug||!['pt-br','en','es','fr-ca'].includes(String(v.locale))||typeof v.name!=='string'||typeof v.currency!=='string'||!/^[A-Z]{3}$/.test(v.currency)||typeof v.timezone!=='string'||v.websiteOrigin!==websiteOrigin)throw new Error('Regional profile does not match this website');
 new Intl.DateTimeFormat('en',{timeZone:v.timezone});new Intl.NumberFormat('en',{style:'currency',currency:v.currency});
 const palette:RegionalProfile['palette']={};for(const k of ['primary','secondary','accent'] as const){const c=(v.palette as Record<string,unknown>|undefined)?.[k];if(typeof c==='string'&&/^#[\da-f]{6}$/i.test(c))palette[k]=c;}
 return {version:1,slug,name:v.name,locale:v.locale as RegionalProfile['locale'],currency:v.currency,timezone:v.timezone,palette,websiteOrigin};
}
export const intlLocale=(region:RegionalProfile)=>({'pt-br':'pt-BR',en:'en-US',es:'es-ES','fr-ca':'fr-CA'}[region.locale]);
export const regionalMoney=(value:number,region:RegionalProfile)=>new Intl.NumberFormat(intlLocale(region),{style:'currency',currency:region.currency}).format(value);
