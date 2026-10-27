import {demoMode} from '@/config/demo';
import LiveBooking from '@/components/booking/live-booking';
import {DemoBooking} from '@/components/booking/demo-booking';
export default function Page(){return demoMode?<DemoBooking/>:<LiveBooking/>}
