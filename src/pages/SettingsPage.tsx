import { useState } from "react";
import Icon from "@/components/ui/icon";

type SettingItem = {
  id: string;
  label: string;
  description?: string;
  type: "toggle" | "select" | "link";
  value?: boolean | string;
  options?: string[];
  icon: string;
};

const settingGroups: { title: string; items: SettingItem[] }[] = [
  {
    title: "Приватность",
    items: [
      { id: "e2e", label: "End-to-end шифрование", description: "Защита всех переписок", type: "toggle", value: true, icon: "Lock" },
      { id: "readReceipts", label: "Подтверждение прочтения", description: "Показывать галочки", type: "toggle", value: true, icon: "CheckCheck" },
      { id: "onlineStatus", label: "Статус «в сети»", description: "Видимость другим пользователям", type: "toggle", value: false, icon: "Eye" },
      { id: "screenshot", label: "Запрет скриншотов", description: "Блокировать снимок экрана", type: "toggle", value: false, icon: "ShieldOff" },
    ],
  },
  {
    title: "Уведомления",
    items: [
      { id: "pushNotif", label: "Push-уведомления", description: "Уведомления о сообщениях", type: "toggle", value: true, icon: "Bell" },
      { id: "sound", label: "Звук уведомлений", description: "Воспроизводить звук", type: "toggle", value: true, icon: "Volume2" },
      { id: "vibration", label: "Вибрация", type: "toggle", value: false, icon: "Smartphone" },
    ],
  },
  {
    title: "Чаты",
    items: [
      { id: "theme", label: "Тема оформления", type: "select", value: "Светлая", options: ["Светлая", "Тёмная", "Системная"], icon: "Sun" },
      { id: "fontSize", label: "Размер шрифта", type: "select", value: "Средний", options: ["Маленький", "Средний", "Большой"], icon: "Type" },
      { id: "autoDelete", label: "Автоудаление", description: "Удалять сообщения автоматически", type: "select", value: "Выключено", options: ["Выключено", "Через 24 часа", "Через 7 дней", "Через 30 дней"], icon: "Trash2" },
    ],
  },
  {
    title: "Аккаунт",
    items: [
      { id: "twoFactor", label: "Двухфакторная аутентификация", type: "toggle", value: false, icon: "Shield" },
      { id: "sessions", label: "Активные сессии", type: "link", icon: "Monitor" },
      { id: "dataExport", label: "Экспорт данных", type: "link", icon: "Download" },
      { id: "deleteAccount", label: "Удалить аккаунт", type: "link", icon: "Trash2" },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, boolean | string>>({
    e2e: true, readReceipts: true, onlineStatus: false, screenshot: false,
    pushNotif: true, sound: true, vibration: false,
    theme: "Светлая", fontSize: "Средний", autoDelete: "Выключено",
    twoFactor: false,
  });

  const toggle = (id: string) => {
    setSettings((s) => ({ ...s, [id]: !s[id] }));
  };

  const select = (id: string, value: string) => {
    setSettings((s) => ({ ...s, [id]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="px-4 py-4 border-b border-border bg-white sticky top-0 z-10">
        <h1 className="font-semibold text-base">Настройки</h1>
      </div>

      <div className="py-2">
        {settingGroups.map((group) => (
          <div key={group.title} className="mb-1">
            <div className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {group.title}
            </div>
            <div className="bg-white border-y border-border divide-y divide-border">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-3 ${item.type === "link" ? "cursor-pointer hover:bg-secondary/40 transition-colors" : ""} ${item.id === "deleteAccount" ? "text-destructive" : ""}`}
                  onClick={item.type === "link" ? () => {} : undefined}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.id === "deleteAccount" ? "bg-red-50" : "bg-secondary"}`}>
                    <Icon
                      name={item.icon}
                      size={15}
                      className={item.id === "deleteAccount" ? "text-destructive" : "text-muted-foreground"}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${item.id === "deleteAccount" ? "text-destructive" : "text-foreground"}`}>
                      {item.label}
                    </div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    )}
                  </div>
                  {item.type === "toggle" && (
                    <button
                      onClick={() => toggle(item.id)}
                      className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${settings[item.id] ? "bg-foreground" : "bg-border"}`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings[item.id] ? "translate-x-5" : "translate-x-1"}`}
                      />
                    </button>
                  )}
                  {item.type === "select" && item.options && (
                    <select
                      value={settings[item.id] as string}
                      onChange={(e) => select(item.id, e.target.value)}
                      className="text-xs text-muted-foreground bg-secondary rounded-lg px-2 py-1 outline-none cursor-pointer border-0"
                    >
                      {item.options.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  )}
                  {item.type === "link" && (
                    <Icon name="ChevronRight" size={15} className="text-muted-foreground shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="px-4 py-6 text-center">
          <p className="text-xs text-muted-foreground">Сигнал v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
            <Icon name="Lock" size={10} />
            Защищён end-to-end шифрованием
          </p>
        </div>
      </div>
    </div>
  );
}
