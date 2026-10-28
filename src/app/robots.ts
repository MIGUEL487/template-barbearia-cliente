import {envFlag} from "@/lib/env-flag";
import type {MetadataRoute} from 'next';export const dynamic='force-static';
export default function robots():MetadataRoute.Robots {return {rules:{userAgent:'*',...(envFlag(process.env.NEXT_PUBLIC_DEMO_WATERMARK)?{disallow:'/'}:{allow:'/'})}}}
