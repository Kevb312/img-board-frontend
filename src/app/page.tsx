"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { api } from "@/lib/api";

interface Board
{
  id: string,
  name: string
}


export default function Home() {

  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    api.get<Board[]>("/boards")
      .then(setBoards)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold p4">Bienvenido</h1>

      <p className="text-gray-500 p4">Selecciona un board para comenzar.</p>


      <ul className="space-y-3">
          {
            boards.map(board => (
              <li key={board.id}>
                  <Link 
                    href={`/board/${board.id}`} 
                    className='block p-4  rounded-lg hover:bg-gray-200 transition'
                  >
                    <span className='font-bold hover:text-red-500'>/{board.id}</span> - {board.name}
                  </Link>
              </li>  
            ))
          }
      </ul>
    </div>
  );
}
