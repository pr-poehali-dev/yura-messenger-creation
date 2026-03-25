import func2url from "../../backend/func2url.json";

const BASE = func2url.messenger;
const USER_ID = 1;

async function get(action: string, extra?: Record<string, string | number>) {
  const params = new URLSearchParams({ action, user_id: String(USER_ID), ...Object.fromEntries(Object.entries(extra || {}).map(([k, v]) => [k, String(v)])) });
  const res = await fetch(`${BASE}/?${params}`);
  return res.json();
}

async function post(body: Record<string, unknown>) {
  const res = await fetch(`${BASE}/?user_id=${USER_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export const api = {
  getChats: () => get("chats"),
  getMessages: (chat_id: number) => get("messages", { chat_id }),
  getNotifications: () => get("notifications"),
  getProfile: () => get("profile"),
  getContacts: () => get("contacts"),
  sendMessage: (chat_id: number, text: string) => post({ action: "send_message", chat_id, text }),
  markRead: () => post({ action: "mark_read" }),
  updateProfile: (data: { display_name: string; bio: string; phone: string }) => post({ action: "update_profile", ...data }),
};
