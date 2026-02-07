import { api } from "./api";

export enum TypeRoom {
  GUDANG = "gudang",
  LAB = "lab",
  KELAS = "kelas",
  GURU = "guru",
}

export interface Room {
  id: string;
  code: string;
  name: string;
  type: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetRoomsResponse {
  success: boolean;
  data: Room[];
  pagination: Pagination;
  message: string;
}

export interface RoomResponse {
  success: boolean;
  data: Room;
  message: string;
}

export interface RoomPayload {
  code: string;
  name: string;
  type: string;
}

export async function getRooms(
  page: number = 1,
  limit: number = 10
): Promise<GetRoomsResponse> {
  return api(`/api/rooms?page=${page}&limit=${limit}`);
}

export async function getRoomById(id: string): Promise<Room> {
  const json = await api(`/api/rooms/${id}`);

  return json.data;
}


export async function createRoom(
  payload: RoomPayload
): Promise<RoomResponse> {
  return api("/api/rooms", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateRoom(
  roomId: string,
  payload: RoomPayload
): Promise<RoomResponse> {
  if (!roomId) throw new Error("Room ID is required");

  return api(`/api/rooms/${roomId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteRoom(
  roomId: string
): Promise<RoomResponse> {
  if (!roomId) throw new Error("Room ID is required");

  return api(`/api/rooms/${roomId}`, {
    method: "DELETE",
  });
}

export async function getDeletedRooms(
  page: number = 1,
  limit: number = 10
): Promise<GetRoomsResponse> {
  return api(`/api/rooms-deleted?page=${page}&limit=${limit}`);
}

export async function restoreDeletedRoom(
  roomId: string
): Promise<Room> {
  if (!roomId) throw new Error("Room ID is required");

  const response = await api(`/api/rooms-restore/${roomId}`, {
    method: "PUT",
  });

  return response.data;
}
