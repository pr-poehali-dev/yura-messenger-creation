import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getProfile().then((d) => {
      if (d.user) {
        setName(d.user.display_name || "");
        setBio(d.user.bio || "");
        setPhone(d.user.phone || "");
        setUsername(d.user.username || "");
      }
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await api.updateProfile({ display_name: name, bio, phone });
    setSaving(false);
    setEditing(false);
  };

  const cancel = () => {
    api.getProfile().then((d) => {
      if (d.user) {
        setName(d.user.display_name || "");
        setBio(d.user.bio || "");
        setPhone(d.user.phone || "");
      }
    });
    setEditing(false);
  };

  const menuItems = [
    { icon: "Smartphone", label: "Устройства", description: "1 активное устройство" },
    { icon: "Key", label: "Ключ шифрования", description: "Верифицирован" },
    { icon: "UserPlus", label: "Пригласить друга", description: "Поделитесь ссылкой" },
    { icon: "HelpCircle", label: "Помощь", description: "Центр поддержки" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-border bg-white flex items-center justify-between sticky top-0 z-10">
        <h1 className="font-semibold text-base">Профиль</h1>
        <button
          onClick={() => editing ? save() : setEditing(true)}
          disabled={saving}
          className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
            editing ? "bg-foreground text-background" : "bg-secondary text-foreground hover:bg-secondary/70"
          }`}
        >
          {saving ? "Сохранение..." : editing ? "Сохранить" : "Изменить"}
        </button>
      </div>

      {/* Avatar block */}
      <div className="bg-white border-b border-border px-4 py-6">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full bg-secondary border-2 border-border flex items-center justify-center text-2xl font-semibold text-foreground">
              {name ? name[0].toUpperCase() : "?"}
            </div>
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
          </div>

          {editing ? (
            <div className="w-full max-w-xs space-y-2">
              <input
                className="w-full text-center text-lg font-semibold bg-secondary rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-foreground/20"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя..."
              />
              <input
                className="w-full text-center text-sm bg-secondary rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-foreground/20 text-muted-foreground"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Телефон..."
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
              <h2 className="text-lg font-semibold">{name}</h2>
              {phone && <p className="text-sm text-muted-foreground mt-0.5">{phone}</p>}
              {bio && <p className="text-xs text-muted-foreground mt-1.5 text-center max-w-xs">{bio}</p>}
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                <Icon name="AtSign" size={11} />
                <span>{username}</span>
              </div>
            </>
          )}
        </div>
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