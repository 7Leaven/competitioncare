import LessonPlayer from './LessonPlayer';

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId } = await params;
  return <LessonPlayer courseId={id} lessonId={lessonId} />;
}
