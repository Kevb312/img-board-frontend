export default async function BoardPage({ params } : { params: Promise<{ board: string }> }) {
  const { board } = await params;

  return (
    <div>
      <h1>Board: {board}</h1>
      <p>Aquí listamos los hilos</p>
    </div>
  );
}
