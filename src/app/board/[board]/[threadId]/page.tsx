"use client";

import { use, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { io, Socket } from "socket.io-client";
import DOMPurify from "dompurify"; 

export default function ThreadPage({ params, initialPosts }: any) {
  const { board, threadId } = use(params);
  const socketRef = useRef<Socket | null>(null);

  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reply, setReply] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const replyBoxRef = useRef(null);


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

  // --- WEBSOCKET PARA AUTOACTUALIZAR ---
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // Unirse a la sala del hilo
    socket.emit("joinThread", { threadId: Number(threadId) });

    // Cuando llegue un nuevo post desde el backend → agregarlo
    socket.on("newPost", (post) => {
      setPosts((prev) => [...prev, post]);
    });

    // Cleanup para evitar fugas de memoria
    return () => {
      socket.emit("leaveThread", { threadId: Number(threadId) });
      socket.disconnect();
    };
  }, [threadId]);


  const sendReply = async () => {
    const form = new FormData();
    form.append("content", reply);
    if (file) form.append("image", file);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/thread/${threadId}`, {
      method: "POST",
      body: form,
    });

    setReply("");
    setFile(null);

    const updated = await api.get<Post[]>(`/posts/thread/${threadId}`);
    setPosts(updated);
  };

  const goToQuotedPost = (postId: number) => {
    const el = document.getElementById(`post-${postId}`);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Highlight temporal (opcional)
    el.classList.add("bg-yellow-100");
    setTimeout(() => el.classList.remove("bg-yellow-100"), 800);
  };


  const handleReplyClick = (postId) => {
    setReply(prev => prev + `>>${postId}\n`);
    scrollToReplyBox();
  };

  const scrollToReplyBox = () => {
    replyBoxRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };


  if (!thread) return <p>Cargando...</p>;

  return (

    <>
      {imagePreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setImagePreview(null)}
        >
          <img
            src={imagePreview}
            className="max-w-[95%] max-h-[95%] rounded shadow-lg"
          />
        </div>
      )}
    
      <div className="border border-[var(--border)] bg-[var(--post-bg)] p-4 rounded mb-6">
        <h1 className="font-bold text-xl mb-1">{thread.title}</h1>

        {
          thread.imageUrl && (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${thread.imageUrl}`}
              className="mb-4 max-w-xs border"
              onClick={() => setImagePreview(process.env.NEXT_PUBLIC_API_URL + thread.imageUrl)}
            />
          )
        }
        
         {/* Sanitizamos el contenido */}
          <p
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(thread.content)
            }}
          />

        <h2 className="text-xl font-bold mb-3">Respuestas</h2>

        {posts.map((p, index) => (
          <div
            key={p.id}
            id={`post-${p.id}`}
            className="border border-[var(--border)] bg-[var(--bg-board)] p-3 rounded"
          >

            {/* HEADER */}
            <div className="text-sm text-gray-600 mb-2 flex gap-3">
              <span className="font-bold">Anon #{p.anonId}</span>

              {/* OP */}
              {p.anonId === posts[0].anonId && (
                <span className="text-red-600 font-semibold">(OP)</span>
              )}

              <span>
                {new Date(p.createdAt).toLocaleString("es-MX", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              <button
                className="text-blue-600 hover:underline ml-auto"
                onClick={() => handleReplyClick(p.id)}


              >
                Responder
              </button>
            </div>

            {/* Imagen */}
            {p.imageUrl && (
              <img
                src={process.env.NEXT_PUBLIC_API_URL + p.imageUrl}
                className="max-w-xs max-h-64 cursor-pointer mt-3 rounded hover:opacity-90 transition"
                onClick={() =>
                  setImagePreview(process.env.NEXT_PUBLIC_API_URL + p.imageUrl)
                }
              />
            )}

            {/* CONTENIDO CON QUOTES */}
            <p className="whitespace-pre-wrap mt-2">
    {p.content.split("\n").map((line, i) =>
      line.startsWith(">>") ? (
        <span
          key={i}
          className="text-green-700 font-semibold cursor-pointer"
          onClick={() =>
            goToQuotedPost(parseInt(line.replace(">>", ""), 10))
          }
        >
          {line}
          <br />
        </span>
      ) : (
        <span key={i}>
          {line}
          <br />
        </span>
      )
    )}
  </p>

          </div>
        ))}


        {/*** Formulario para responder al post general */}
        <div ref={replyBoxRef} className="space-y-3 mt-6">
          <textarea
            className="w-full border border-[var(--border)] p-2 rounded bg-white"
            rows={3}
            placeholder="Responder..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />


          <button
            onClick={sendReply}
          className="px-4 py-2 bg-[var(--link)] text-white rounded">
            Enviar respuesta
          </button>
        </div>
      </div>
    </>
    
  );

}
