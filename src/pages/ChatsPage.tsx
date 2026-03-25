import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

interface Chat {
  id: number;
  type: string;
  name: string;
  avatar: string;
  online: boolean;
  last_message: string;
  last_message_time: string;
  unread: number;
}

interface Message {
  id: number;
  text: string;
  created_at: string;
  sender_id: number;
  sender_name: string;
  is_mine: boolean;
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
}

function formatChatTime(date: string) {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000 && now.getDate() === d.getDate()) return formatTime(date);
  if (diff < 172800000) return "вчера";
  return d.toLocaleDateString("ru", { day: "numeric", month: "short" });
}

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getChats().then((d) => {
      setChats(d.chats || []);
      setLoadingChats(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedChat) return;
    setLoadingMsgs(true);
    api.getMessages(selectedChat).then((d) => {
      setMsgs(d.messages || []);
      setLoadingMsgs(false);
    });
  }, [selectedChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const chat = chats.find((c) => c.id === selectedChat);

  const sendMessage = async () => {
    if (!input.trim() || !selectedChat) return;
    const text = input.trim();
    setInput("");
    const res = await api.sendMessage(selectedChat, text);
    const newMsg: Message = {
      id: res.id || Date.now(),
      text,
      created_at: res.created_at || new Date().toISOString(),
      sender_id: 1,
      sender_name: "Алексей",
      is_mine: true,
    };
    setMsgs((prev) => [...prev, newMsg]);
    setChats((prev) => prev.map((c) =>
      c.id === selectedChat ? { ...c, last_message: text, unread: 0 } : c
    ));
  };

  return (
    <div className="flex h-full">
      {/* Chat list */}
      <div className={`flex flex-col border-r border-border bg-white ${selectedChat ? "hidden md:flex" : "flex"} md:w-80 w-full shrink-0`}>
        <div className="px-4 py-3.5 border-b border-border">
          <h1 className="font-semibold text-base text-foreground">Сообщения</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{chats.length} диалогов</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {loadingChats ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-5 h-5 border-2 border-border border-t-foreground rounded-full animate-spin" />
            </div>
          ) : chats.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedChat(c.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors text-left ${selectedChat === c.id ? "bg-secondary/60" : ""}`}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold text-foreground">
                  {c.avatar}
                </div>
                {c.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate text-foreground">{c.name}</span>
                    <Icon name="Lock" size={10} className="text-muted-foreground shrink-0" />
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0 ml-2">{formatChatTime(c.last_message_time)}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-muted-foreground truncate">{c.last_message}</span>
                  {c.unread > 0 && (
                    <span className="ml-2 bg-foreground text-background text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className={`flex-1 flex flex-col ${selectedChat ? "flex" : "hidden md:flex"}`}>
        {chat ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-white">
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden text-muted-foreground hover:text-foreground mr-1"
              >
                <Icon name="ArrowLeft" size={18} />
              </button>
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold">
                  {chat.avatar}
                </div>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div>
                <div className="font-medium text-sm">{chat.name}</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Icon name="Lock" size={9} />
                  <span>Сквозное шифрование</span>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2 text-muted-foreground">
                <button className="p-1.5 hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
                  <Icon name="Phone" size={16} />
                </button>
                <button className="p-1.5 hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
                  <Icon name="Video" size={16} />
                </button>
                <button className="p-1.5 hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
                  <Icon name="MoreHorizontal" size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-background">
              <div className="text-center text-[11px] text-muted-foreground py-2">
                <span className="bg-secondary px-3 py-1 rounded-full inline-flex items-center gap-1">
                  <Icon name="Lock" size={9} />
                  Сообщения защищены шифрованием
                </span>
              </div>
              {loadingMsgs ? (
                <div className="flex items-center justify-center h-20">
                  <div className="w-4 h-4 border-2 border-border border-t-foreground rounded-full animate-spin" />
                </div>
              ) : msgs.map((m) => (
                <div
                  key={m.id}
                  className={`flex animate-slide-up ${m.is_mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[72%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                      m.is_mine
                        ? "bg-foreground text-background rounded-br-sm"
                        : "bg-white border border-border text-foreground rounded-bl-sm shadow-sm"
                    }`}
                  >
                    <p>{m.text}</p>
                    <div className={`text-[10px] mt-1 text-right ${m.is_mine ? "text-background/60" : "text-muted-foreground"}`}>
                      {formatTime(m.created_at)}
                      {m.is_mine && <Icon name="CheckCheck" size={10} className="inline ml-1" />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border bg-white">
              <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2">
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Icon name="Paperclip" size={17} />
                </button>
                <input
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Сообщение..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Icon name="Smile" size={17} />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-7 h-7 bg-foreground text-background rounded-lg flex items-center justify-center transition-opacity disabled:opacity-30"
                >
                  <Icon name="Send" size={13} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Icon name="MessageCircle" size={24} className="text-muted-foreground" />
            </div>
            <h2 className="font-semibold text-foreground">Выберите чат</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">Выберите диалог из списка, чтобы начать общение</p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon name="Lock" size={11} />
              <span>Все сообщения защищены end-to-end шифрованием</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}