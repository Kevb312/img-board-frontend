export default async function ThreadPage({
  params,
}: {
  params: Promise<{ board: string; threadId: string }>;
}) {
  const { board, threadId } = await params;

  return (
    <div>
      <h1>Hilo #{threadId} en /{board}</h1>
      <p>Aquí van los post del hilo</p>
    </div>
  );
}
