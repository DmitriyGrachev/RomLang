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
import './deep-course.css';
import './theory-visuals.css';
export const metadata:Metadata={title:'Română — от основ до B2',description:'Подробный курс румынского с нуля до B2: теория, практика, аудирование, речь и письмо для жизни в Бухаресте.',icons:{icon:'/favicon.svg'}};
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>}
