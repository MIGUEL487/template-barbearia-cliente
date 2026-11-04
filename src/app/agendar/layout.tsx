import localFont from 'next/font/local';
import './booking.css';
const bookingCormorant=localFont({src:'../fonts/cinzel.ttf',weight:'400 900',variable:'--font-booking-display',display:'swap'});
const bookingJakarta=localFont({src:'../fonts/outfit.ttf',weight:'100 900',variable:'--font-booking-sans',display:'swap'});
export default function BookingLayout({children}:{children:React.ReactNode}){
 return <div className={`${bookingCormorant.variable} ${bookingJakarta.variable} booking-scope`}>{children}</div>;
}
