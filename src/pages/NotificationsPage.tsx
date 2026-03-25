import { useState } from "react";
import Icon from "@/components/ui/icon";

const initialNotifications = [
  {
    id: 1, type: "message", read: false,
    title: "Мария Соколова",
    text: "Встретимся в 18:00 у метро",
    time: "2 мин назад", avatar: "М",
  },
  {
    id: 2, type: "message", read: false,
    title: "Команда проекта",
    text: "Анна: Презентация готова, жду правок",
    time: "15 мин назад", avatar: "К",
  },
  {
    id: 3, type: "message", read: false,
    title: "Дмитрий Орлов",
    text: "Посмотрел файл — всё выглядит отлично 👍",
    time: "1 час назад", avatar: "Д",
  },
  {
    id: 4, type: "system", read: true,
    title: "Безопасность",
    text: "Ваши сообщения защищены end-to-end шифрованием",
    time: "вчера", avatar: null,
  },
  {
    id: 5, type: "message", read: true,
    title: "Наташа Иванова",
    text: "Спасибо за помощь! Очень выручил",
    time: "вчера", avatar: "Н",
  },
  {
    id: 6, type: "system", read: true,
    title: "Новый контакт",
    text: "Павел Кузнецов добавил вас в контакты",
    time: "2 дня назад", avatar: null,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-4 py-4 border-b border-border bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-base">Уведомления</h1>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">{unreadCount} непрочитанных</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-lg hover:bg-secondary"
            >
              Прочитать все
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markRead(n.id)}
            className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-secondary/40 ${!n.read ? "bg-secondary/20" : ""}`}
          >
            <div className="shrink-0 mt-0.5">
              {n.avatar ? (
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold relative">
                  {n.avatar}
                  {!n.read && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-foreground rounded-full border-2 border-background"></span>
                  )}
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Icon name={n.type === "system" ? "Shield" : "Bell"} size={16} className="text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm font-medium ${!n.read ? "text-foreground" : "text-foreground/80"}`}>
                  {n.title}
                </span>
                <span className="text-[11px] text-muted-foreground shrink-0">{n.time}</span>
              </div>
              <p className={`text-xs mt-0.5 line-clamp-2 ${!n.read ? "text-foreground/80" : "text-muted-foreground"}`}>
                {n.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {unreadCount === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-3">
            <Icon name="BellOff" size={20} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Нет непрочитанных уведомлений</p>
        </div>
      )}
    </div>
  );
}
