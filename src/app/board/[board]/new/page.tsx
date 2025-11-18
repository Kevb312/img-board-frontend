"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function NewThread() {
  const router = useRouter();
  const params = useParams();
  const board = params.board as string;  // ← AQUÍ YA FUNCIONA

  console.log("board:", board);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("boardId", board);

    if (file) {
      formData.append("image", file); // El nombre tiene que coincidir con FilesInterceptor('image')
    }

    const thread = await api.postForm("/threads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    router.push(`/board/${board}/${thread.id}`);
}


  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Crear nuevo hilo en este board: {board}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Título del hilo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="border p-2 rounded w-full"
          placeholder="Contenido del hilo"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input type="file" accept="image/*"  onChange={(e) => setFile(e.target.files?.[0] || null)} className="border p-2 rounded w-full" />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Crear hilo
        </button>
      </form>
    </div>
  );
}
