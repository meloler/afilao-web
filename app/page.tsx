import Afilao from './ui/afilao';
export default function Home() { return <Afilao previewOnly={process.env.AFILAO_PRESENTATION_DEMO === '1'} />; }
