import { api } from "@/lib/api";

export function getAvailableDetailItems(
  itemId: string,
  roomId: string
) {
  return api(
    `/api/detail-items?item_id=${itemId}&room_id=${roomId}&status=available`
  );
}
export function getDetailItemsByRoom(roomId: string) {
  return api(`/api/detail-items?room_id=${roomId}&status=available`);
}