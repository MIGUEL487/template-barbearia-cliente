import {demoMode} from '@/config/demo';import LiveManagement from '@/components/booking/live-management';import {DemoManagement} from '@/components/booking/demo-management';
export default function Page(){return demoMode?<DemoManagement/>:<LiveManagement/>}
