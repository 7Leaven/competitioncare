import TakeTestClient from './TakeTestClient';

export default async function TakeTestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TakeTestClient testId={id} />;
}


