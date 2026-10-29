import localFont from 'next/font/local';
import './booking.css';
const bookingCormorant=localFont({src:'../fonts/cormorant-garamond-latin-wght-normal.woff2',weight:'300 700',variable:'--font-booking-display',display:'swap'});
const bookingJakarta=localFont({src:'../fonts/plus-jakarta-sans-latin-wght-normal.woff2',weight:'200 800',variable:'--font-booking-sans',display:'swap'});
export default function BookingLayout({children}:{children:React.ReactNode}){
 return <div className={`${bookingCormorant.variable} ${bookingJakarta.variable} booking-scope`}>{children}</div>;
}
