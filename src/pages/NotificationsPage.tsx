import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

interface Notif {
  id: number;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "только что";
  if (min < 60) return `${min} мин назад`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} ч назад`;
  return `${Math.floor(h / 24)} дн назад`;
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNotifications().then((d) => {
      setNotifs(d.notifications || []);
      setLoading(false);
    });
  }, []);

  const unread = notifs.filter((n) => !n.is_read).length;

  const markAll = async () => {
    await api.markRead();
    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-4 py-3.5 border-b border-border bg-white flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-base">Уведомления</h1>
          {unread > 0 && <p className="text-xs text-muted-foreground mt-0.5">{unread} непрочитанных</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAll} className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary">
            Прочитать все
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-5 h-5 border-2 border-border border-t-foreground rounded-full animate-spin" />
          </div>
        ) : notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-3">
              <Icon name="BellOff" size={20} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Уведомлений пока нет</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifs.map((n) => (
              <div key={n.id} className={`flex items-start gap-3 px-4 py-3.5 transition-colors ${!n.is_read ? "bg-secondary/30" : "hover:bg-secondary/20"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.type === "message" ? "bg-secondary" : "bg-secondary"}`}>
                  <Icon name={n.type === "message" ? "MessageCircle" : "Shield"} size={16} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium truncate">{n.title}</span>
                    <span className="text-[11px] text-muted-foreground shrink-0">{timeAgo(n.created_at)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                </div>
                {!n.is_read && <div className="w-2 h-2 rounded-full bg-foreground shrink-0 mt-2" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}