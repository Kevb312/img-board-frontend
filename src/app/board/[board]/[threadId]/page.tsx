"use client";

import { use, useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ThreadPage({ params }: any) {
  const { board, threadId } = use(params); // ← Aquí se resuelve el Promise

  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reply, setReply] = useState("");

  // cargar hilo
  useEffect(() => {
    api.get(`/threads/${threadId}`)
      .then(setThread)
      .catch(console.error);
  }, [threadId]);

  // cargar posts
  useEffect(() => {
    api.get(`/posts/thread/${threadId}`)
      .then(setPosts)
      .catch(console.error);
  }, [threadId]);

  const sendReply = async () => {
    await api.post(`/posts/thread/${threadId}`, {
      content: reply,
    });

    setReply("");

    api.get(`/posts/thread/${threadId}`)
      .then(setPosts);
  };

  if (!thread) return <p>Cargando...</p>;

  return (
    <div className="border border-[var(--border)] bg-[var(--post-bg)] p-4 rounded mb-6">
      <h1 className="font-bold text-xl mb-1">{thread.title}</h1>

      {
        thread.imageUrl && (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${thread.imageUrl}`}
            className="mb-4 max-w-xs border"
          />
        )
      }
      
      <p  className="mt-3 whitespace-pre-line">{thread.content}</p>


      <h2 className="text-xl font-bold mb-3">Respuestas</h2>

      {posts.map((p) => (
        <div key={p.id}className="border border-[var(--border)] bg-[var(--bg-board)] p-3 rounded">
          
          <p className="mt-2 whitespace-pre-line">{p.content}</p>
        </div>
      ))}

      <div className="space-y-3 mt-6">
        <textarea
          className="w-full border border-[var(--border)] p-2 rounded bg-white"
          rows={3}
          placeholder="Responder..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />

        <button
          onClick={sendReply}
         className="px-4 py-2 bg-[var(--link)] text-white rounded">
          Enviar respuesta
        </button>
      </div>
    </div>
  );
}
