import { useState } from "react";
import Icon from "@/components/ui/icon";

const chats = [
  {
    id: 1, name: "Мария Соколова", avatar: "М", online: true,
    lastMessage: "Хорошо, встретимся в 18:00 у метро",
    time: "14:32", unread: 2, encrypted: true,
  },
  {
    id: 2, name: "Дмитрий Орлов", avatar: "Д", online: false,
    lastMessage: "Посмотрел файл — всё выглядит отлично 👍",
    time: "12:10", unread: 0, encrypted: true,
  },
  {
    id: 3, name: "Команда проекта", avatar: "К", online: true,
    lastMessage: "Анна: Презентация готова, жду правок",
    time: "10:55", unread: 5, encrypted: true,
  },
  {
    id: 4, name: "Наташа Иванова", avatar: "Н", online: false,
    lastMessage: "Спасибо за помощь! Очень выручил",
    time: "вчера", unread: 0, encrypted: true,
  },
  {
    id: 5, name: "Сергей Морозов", avatar: "С", online: false,
    lastMessage: "Завтра созвонимся по проекту",
    time: "вчера", unread: 0, encrypted: true,
  },
  {
    id: 6, name: "Анна Петрова", avatar: "А", online: true,
    lastMessage: "Ок, договорились!",
    time: "пн", unread: 0, encrypted: true,
  },
];

const messages = [
  { id: 1, from: "other", text: "Привет! Как дела?", time: "14:20" },
  { id: 2, from: "me", text: "Привет! Отлично, спасибо. Ты как?", time: "14:22" },
  { id: 3, from: "other", text: "Тоже хорошо. Ты не забыл про встречу сегодня?", time: "14:25" },
  { id: 4, from: "me", text: "Нет, помню! В 18:00 у метро, верно?", time: "14:28" },
  { id: 5, from: "other", text: "Да, именно. Захвати зонт — обещают дождь", time: "14:30" },
  { id: 6, from: "other", text: "Хорошо, встретимся в 18:00 у метро", time: "14:32" },
];

export default function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState(messages);

  const chat = chats.find((c) => c.id === selectedChat);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMsgs([...msgs, { id: Date.now(), from: "me", text: input, time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
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
          {chats.map((c) => (
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
                    {c.encrypted && <Icon name="Lock" size={10} className="text-muted-foreground shrink-0" />}
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0 ml-2">{c.time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-muted-foreground truncate">{c.lastMessage}</span>
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
              {msgs.map((m) => (
                <div
                  key={m.id}
                  className={`flex animate-slide-up ${m.from === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[72%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                      m.from === "me"
                        ? "bg-foreground text-background rounded-br-sm"
                        : "bg-white border border-border text-foreground rounded-bl-sm shadow-sm"
                    }`}
                  >
                    <p>{m.text}</p>
                    <div className={`text-[10px] mt-1 text-right ${m.from === "me" ? "text-background/60" : "text-muted-foreground"}`}>
                      {m.time}
                      {m.from === "me" && <Icon name="CheckCheck" size={10} className="inline ml-1" />}
                    </div>
                  </div>
                </div>
              ))}
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
