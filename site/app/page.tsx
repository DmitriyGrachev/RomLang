import CourseApp from './components/CourseApp';
import {getChatGPTUser} from './chatgpt-auth';
import {learningAccountScope} from '../lib/course/account-scope';
export const dynamic='force-dynamic';
export default async function Home(){const user=await getChatGPTUser();const accountScope=user?await learningAccountScope(user.userId):null;return <CourseApp key={accountScope??'guest'} accountScope={accountScope}/>}
