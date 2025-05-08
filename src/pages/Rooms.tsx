

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from "@apollo/client";
import { useUserData } from '@nhost/react';
import { CREATE_ROOM, DELETE_ROOM, ADD_COMMENT_TO_ROOM } from "../graphQL/mutations/Rooms";
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, PlusCircle, Users, Send, XCircle, AlertCircle } from 'lucide-react';
import '../index.css';


type Room = {
  id: string;
  name: string;
  messages: Message[]; 
}

type Message = {
  id: string;
  content: string;
  user_id: string;
  created_at: any;
  room_id?: string;
}


const GET_ROOMS_WITH_MESSAGES = gql`
  query GetRoomsWithMessages {
    rooms {
      id
      name
      created_at
      user_id
      messages {
        id
        content
        user_id
        created_at
        room_id
      }
    }
  }
`;

const RoomsPage = () => {
  const { loading, error: queryError, data, refetch } = useQuery(GET_ROOMS_WITH_MESSAGES);
  const [createRoomMutation, { error: createRoomError }] = useMutation(CREATE_ROOM);
  const [addCommentMutation, { error: addCommentError }] = useMutation(ADD_COMMENT_TO_ROOM);
  // const [deleteRoomMutation, { error: deleteRoomError }] = useMutation(DELETE_ROOM); 

  const [newRoomName, setNewRoomName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const  user  = useUserData();

  console.log(user);

  const [localError, setLocalError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (data?.rooms) {
        
      setRooms(
        data.rooms.map((room: any) => ({
          ...room,
          messages: room.messages,
        })) as Room[]
      );
    }
  }, [data]);

  const handleCreateRoom = async () => {

    if (!user || !user.id) {
        setLocalError("Você precisa estar autenticado para criar uma sala.");
        return;
    }
    
    if (!newRoomName.trim()) {
      setLocalError("Por favor, insira um nome para a sala.");
      return;
    }
    if (rooms.some(room => room.name.toLowerCase() === newRoomName.toLowerCase())) {
      setLocalError("Já existe uma sala com este nome.");
      return;
    }

    try {
      
      const result = await createRoomMutation({
        variables: { name: newRoomName},
      });
      if (result.data?.insert_rooms_one?.id) {
        setNewRoomName('');
        setLocalError(null);
        refetch(); 
      } else {
        setLocalError("Erro ao criar a sala.");
      }
    } catch (err: any) {
        console.error("Erro ao criar sala:", err?.message || err);
        setLocalError("Erro ao criar a sala: " + (err?.message || "desconhecido"));
      }
      
  };

  const handleOpenRoom = (room: Room) => {
    setSelectedRoom(room);
    setNewCommentText('');
    setLocalError(null);
  };

  const handleCloseRoom = () => {
    setSelectedRoom(null);
    setLocalError(null);
  };

  const handleAddComment = async () => {

    if (!user || !user.id) {
        setLocalError("Você precisa estar autenticado para comentar.");
        return;
    }
    if (!newCommentText.trim() || !selectedRoom) {
      setLocalError("Por favor, insira um comentário.");
      return;
    }

    try {
      
      const result = await addCommentMutation({
        variables: { room_id: selectedRoom.id, content: newCommentText },
      });
      if (result.data?.insert_messages_one?.id) {
        setNewCommentText('');
        setLocalError(null);
        refetch(); 
        
      } else {
        setLocalError("Erro ao adicionar o comentário.");
      }
    } catch (err: any) {
      console.error("Erro ao adicionar comentário:", err);
      setLocalError("Erro ao adicionar o comentário.");
    }
  };

  const getFormattedTimestamp = (timestamp: any) => {
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day; 
    const year = 365 * day; 

    if (diff < minute) {
      return `${Math.floor(diff / 1000)} segundos atrás`;
    } else if (diff < hour) {
      return `${Math.floor(diff / minute)} minutos atrás`;
    } else if (diff < day) {
      return `${Math.floor(diff / hour)} horas atrás`;
    } else if (diff < week) {
      return `${Math.floor(diff / day)} dias atrás`;
    } else if (diff < month) {
      return `${Math.floor(diff / week)} semanas atrás`;
    } else if (diff < year) {
      return `${Math.floor(diff / month)} meses atrás`;
    } else {
      return `${Math.floor(diff / year)} anos atrás`;
    }
  };

  if (loading) return <p>Carregando salas...</p>;
  if (queryError) return <p>Erro ao carregar salas: {queryError.message}</p>;
  if (createRoomError) console.error("Erro na mutation de criar sala:", createRoomError);
  if (addCommentError) console.error("Erro na mutation de adicionar comentário:", addCommentError);
  // if (deleteRoomError) console.error("Erro na mutation de deletar sala:", deleteRoomError);

  const displayedError = localError || createRoomError?.message || addCommentError?.message;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-black-600 text-center mb-6">
        Bem-vindo ao Feedback Autônomo
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-green-500" />
          Criar Nova Sala
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Nome da Sala"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateRoom();
              }
            }}
          />
          <button
            onClick={handleCreateRoom}
            className="bg-green-500 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4 focus:outline-none focus:shadow-outline flex items-center gap-2"
            disabled={!newRoomName.trim()}
          >
            <PlusCircle className="w-4 h-4" />
            Criar Sala
          </button>
        </div>
        {displayedError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {displayedError}
          </motion.p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-700" />
          Salas Disponíveis
        </h2>
        <div className="max-h-96 overflow-y-auto">
          <div className="space-y-3">
            <AnimatePresence>
              {rooms.map((room) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-50 rounded-md p-3 flex justify-between items-center hover:bg-gray-100 transition duration-150"
                >
                  <span className="font-medium">{room.name}</span>
                  <button
                    onClick={() => handleOpenRoom(room)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md py-2 px-4 focus:outline-none focus:shadow-outline text-sm flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Ver Sala
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {rooms.length === 0 && !loading && (
              <p className="text-gray-500 text-center">Nenhuma sala criada ainda.</p>
            )}
          </div>
        </div>
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{selectedRoom.name}</h2>
              <button
                onClick={handleCloseRoom}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <AnimatePresence>
                {selectedRoom.messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-100 rounded-md p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{/* Aqui você pode buscar o nome do usuário com base no message.user_id */}Usuário {message.user_id.substring(0, 8)}</span>
                      <span className="text-xs text-gray-500">{getFormattedTimestamp(message.created_at)}</span>
                    </div>
                    <p className="text-gray-700">{message.content}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {selectedRoom.messages.length === 0 && (
                <p className="text-gray-500 text-center">Nenhum comentário ainda.</p>
              )}
            </div>
            <div className="p-4 flex gap-4 border-t border-gray-200">
              <textarea
                placeholder="Digite seu comentário..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md py-2 px-4 focus:outline-none focus:shadow-outline flex items-center gap-2"
                disabled={!newCommentText.trim() || !selectedRoom}
              >
                <Send className="w-4 h-4" />
                Enviar
              </button>
            </div>
            {localError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {localError}
              </motion.p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;



