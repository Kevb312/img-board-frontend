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

      <ul className="space-y-3">
        {threads.map((t) => (
          <li key={t.id} className="p-4 bg-gray-100 rounded hover:bg-gray-200 transition">
            <Link href={`/${board}/${t.id}`}>
              <h2 className="font-bold">{t.title}</h2>
              <p className="text-sm text-gray-600">{t.content}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
