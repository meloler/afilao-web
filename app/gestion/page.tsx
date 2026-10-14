import { getChatGPTUser, chatGPTSignInPath } from '../chatgpt-auth';
import { addDays, today, validDate } from '../lib/domain';
import Management from '../ui/management';
export const dynamic = 'force-dynamic';
export default async function ManagementPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const previewOnly = process.env.AFILAO_PRESENTATION_DEMO === '1' && process.env.VERCEL_ENV === 'preview';
  const user = await getChatGPTUser();
  if (!user && !previewOnly) return <main className="auth-card"><a href="/">Volver a Afilao</a><h1>TU BAR.<br />TUS MESAS.</h1><p>Entra para revisar las reservas y probar el plano. El acceso a esta versión es privado.</p><a className="button" href={chatGPTSignInPath('/gestion')} target="_top">Entrar a la gestión</a></main>;
  const query = await searchParams;
  return <Management initialDate={query.date && validDate(query.date) ? query.date : addDays(today(), 1)} previewOnly={previewOnly} />;
}
