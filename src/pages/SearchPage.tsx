import { useState } from "react";
import Icon from "@/components/ui/icon";

const contacts = [
  { id: 1, name: "Мария Соколова", status: "Дизайнер • в сети", avatar: "М", online: true },
  { id: 2, name: "Дмитрий Орлов", status: "Разработчик • был 2 ч назад", avatar: "Д", online: false },
  { id: 3, name: "Анна Петрова", status: "Менеджер • в сети", avatar: "А", online: true },
  { id: 4, name: "Сергей Морозов", status: "Аналитик • был вчера", avatar: "С", online: false },
  { id: 5, name: "Наташа Иванова", status: "Маркетинг • был вчера", avatar: "Н", online: false },
  { id: 6, name: "Павел Кузнецов", status: "CEO • в сети", avatar: "П", online: true },
];

const recentMessages = [
  { id: 1, from: "Мария Соколова", text: "Встретимся в 18:00 у метро", time: "сегодня" },
  { id: 2, from: "Команда проекта", text: "Презентация готова, жду правок", time: "сегодня" },
  { id: 3, from: "Дмитрий Орлов", text: "Посмотрел файл — всё выглядит отлично", time: "вчера" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "contacts" | "messages">("all");

  const filteredContacts = contacts.filter(
    (c) => query === "" || c.name.toLowerCase().includes(query.toLowerCase())
  );
  const filteredMessages = recentMessages.filter(
    (m) => query === "" || m.text.toLowerCase().includes(query.toLowerCase()) || m.from.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-4 py-4 border-b border-border bg-white">
        <h1 className="font-semibold text-base mb-3">Поиск</h1>
        <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2.5">
          <Icon name="Search" size={16} className="text-muted-foreground shrink-0" />
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Поиск контактов и сообщений..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <Icon name="X" size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          {(["all", "contacts", "messages"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeFilter === f ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "Все" : f === "contacts" ? "Контакты" : "Сообщения"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {(activeFilter === "all" || activeFilter === "contacts") && (
          <div>
            <div className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Контакты
            </div>
            {filteredContacts.length === 0 ? (
              <div className="px-4 py-4 text-sm text-muted-foreground">Не найдено</div>
            ) : (
              filteredContacts.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors cursor-pointer">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold">
                      {c.avatar}
                    </div>
                    {c.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.status}</div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary">
                    <Icon name="MessageCircle" size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {(activeFilter === "all" || activeFilter === "messages") && (
          <div>
            <div className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-t border-border">
              Сообщения
            </div>
            {filteredMessages.length === 0 ? (
              <div className="px-4 py-4 text-sm text-muted-foreground">Не найдено</div>
            ) : (
              filteredMessages.map((m) => (
                <div key={m.id} className="flex items-start gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold shrink-0">
                    {m.from[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{m.from}</span>
                      <span className="text-[11px] text-muted-foreground">{m.time}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {query ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: m.text.replace(
                              new RegExp(`(${query})`, "gi"),
                              '<mark class="bg-foreground/10 rounded px-0.5">$1</mark>'
                            ),
                          }}
                        />
                      ) : m.text}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {query === "" && (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-3">
              <Icon name="Search" size={20} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Введите имя или текст сообщения</p>
          </div>
        )}
      </div>
    </div>
  );
}
