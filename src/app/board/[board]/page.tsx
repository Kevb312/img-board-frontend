"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

interface Thread {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export default function BoardPage() {

  const params = useParams();
  const board = params.board as string;

  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    api.get<Thread[]>(`/threads/board/${board}`)
      .then(setThreads)
      .catch(console.error);
  }, [board]);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">/{board}/</h1>

      {threads.length === 0 && <p>No hay hilos aún</p>}

      <div className="mb-6 flex justify-between items-center">
        <Link 
          href={`/board/${board}/new`}
          className="text-[var(--link)] underline"
        >
          Crear nuevo hilo
        </Link>
      </div>
     

      <ul className="space-y-3">
        {threads.map((t) => (
          <li key={t.id} className="border border-[var(--border)] bg-[var(--post-bg)] p-3 rounded">
            <Link href={`/board/${board}/${t.id}`} className="text-lg font-semibold text-[var(--link)]">
              <h2 className="font-bold">{t.title}</h2>
              <p className="text-sm text-gray-700 line-clamp-2">{t.content}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
