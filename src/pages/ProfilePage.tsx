import { useState } from "react";
import Icon from "@/components/ui/icon";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Алексей Смирнов");
  const [status, setStatus] = useState("На связи 🚀");
  const [bio, setBio] = useState("Продуктовый менеджер. Люблю минимализм и чистый дизайн.");
  const [savedName, setSavedName] = useState(name);
  const [savedStatus, setSavedStatus] = useState(status);
  const [savedBio, setSavedBio] = useState(bio);

  const save = () => {
    setSavedName(name);
    setSavedStatus(status);
    setSavedBio(bio);
    setEditing(false);
  };

  const cancel = () => {
    setName(savedName);
    setStatus(savedStatus);
    setBio(savedBio);
    setEditing(false);
  };

  const stats = [
    { label: "Чатов", value: "6" },
    { label: "Сообщений", value: "1.2k" },
    { label: "Контактов", value: "24" },
  ];

  const menuItems = [
    { icon: "Smartphone", label: "Устройства", description: "1 активное устройство" },
    { icon: "Key", label: "Ключ шифрования", description: "Верифицирован" },
    { icon: "UserPlus", label: "Пригласить друга", description: "Поделитесь ссылкой" },
    { icon: "HelpCircle", label: "Помощь", description: "Центр поддержки" },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border bg-white flex items-center justify-between sticky top-0 z-10">
        <h1 className="font-semibold text-base">Профиль</h1>
        <button
          onClick={() => editing ? save() : setEditing(true)}
          className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
            editing ? "bg-foreground text-background" : "bg-secondary text-foreground hover:bg-secondary/70"
          }`}
        >
          {editing ? "Сохранить" : "Изменить"}
        </button>
      </div>

      {/* Avatar block */}
      <div className="bg-white border-b border-border px-4 py-6">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full bg-secondary border-2 border-border flex items-center justify-center text-2xl font-semibold text-foreground">
              А
            </div>
            {editing && (
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-foreground text-background rounded-full flex items-center justify-center border-2 border-white">
                <Icon name="Camera" size={12} />
              </button>
            )}
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
          </div>

          {editing ? (
            <div className="w-full max-w-xs space-y-2">
              <input
                className="w-full text-center text-lg font-semibold bg-secondary rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-foreground/20"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="w-full text-center text-sm bg-secondary rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-foreground/20 text-muted-foreground"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Статус..."
              />
              <textarea
                className="w-full text-center text-sm bg-secondary rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-foreground/20 text-muted-foreground resize-none"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="О себе..."
              />
              <button
                onClick={cancel}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                Отмена
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold">{savedName}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{savedStatus}</p>
              <p className="text-xs text-muted-foreground mt-1.5 text-center max-w-xs">{savedBio}</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                <Icon name="AtSign" size={11} />
                <span>alexey_smirnov</span>
              </div>
            </>
          )}
        </div>

        {/* Stats */}
        {!editing && (
          <div className="flex mt-5 divide-x divide-border border border-border rounded-xl overflow-hidden">
            {stats.map((s) => (
              <div key={s.label} className="flex-1 py-3 flex flex-col items-center">
                <span className="text-base font-semibold">{s.value}</span>
                <span className="text-[11px] text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="py-2">
        <div className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Аккаунт
        </div>
        <div className="bg-white border-y border-border divide-y divide-border">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Icon name={item.icon} size={15} className="text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
              <Icon name="ChevronRight" size={15} className="text-muted-foreground" />
            </button>
          ))}
        </div>

        <div className="mt-2 bg-white border-y border-border">
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors text-destructive">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
              <Icon name="LogOut" size={15} className="text-destructive" />
            </div>
            <span className="text-sm font-medium">Выйти из аккаунта</span>
          </button>
        </div>

        <div className="px-4 py-5 text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Icon name="Lock" size={10} />
            Ваши данные защищены end-to-end шифрованием
          </p>
        </div>
      </div>
    </div>
  );
}
