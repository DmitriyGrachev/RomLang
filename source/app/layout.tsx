import type {Metadata,Viewport} from 'next';
import './globals.css';
import './learning-app.css';
import './practice-app.css';
import './study-app.css';
import './word-memory.css';
import './clinic.css';
import './life-study.css';
import './phone.css';
import './academy.css';
import './cards.css';
export const metadata:Metadata={title:'Română — румынский для жизни',description:'Личный курс румынского A1–B2. Теория, практика и твоя жизнь в Бухаресте.',icons:{icon:'/favicon.svg'}};
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>}
