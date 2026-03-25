import { useState } from "react";
import Icon from "@/components/ui/icon";

const mediaItems = [
  { id: 1, type: "image", from: "Мария Соколова", date: "сегодня", bg: "bg-stone-200", emoji: "🌅" },
  { id: 2, type: "image", from: "Дмитрий Орлов", date: "сегодня", bg: "bg-slate-200", emoji: "🏙️" },
  { id: 3, type: "video", from: "Команда проекта", date: "вчера", bg: "bg-zinc-200", emoji: "🎬" },
  { id: 4, type: "image", from: "Анна Петрова", date: "вчера", bg: "bg-neutral-200", emoji: "🌿" },
  { id: 5, type: "image", from: "Наташа Иванова", date: "вчера", bg: "bg-stone-100", emoji: "📸" },
  { id: 6, type: "video", from: "Мария Соколова", date: "пн", bg: "bg-slate-100", emoji: "🎥" },
  { id: 7, type: "image", from: "Сергей Морозов", date: "пн", bg: "bg-zinc-300", emoji: "🌄" },
  { id: 8, type: "image", from: "Дмитрий Орлов", date: "пн", bg: "bg-stone-300", emoji: "🖼️" },
  { id: 9, type: "image", from: "Анна Петрова", date: "вс", bg: "bg-neutral-300", emoji: "🌸" },
];

const filters = ["Все", "Фото", "Видео"];

export default function GalleryPage() {
  const [filter, setFilter] = useState("Все");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = mediaItems.filter((m) => {
    if (filter === "Фото") return m.type === "image";
    if (filter === "Видео") return m.type === "video";
    return true;
  });

  const selectedItem = mediaItems.find((m) => m.id === selected);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-4 py-4 border-b border-border bg-white">
        <h1 className="font-semibold text-base mb-3">Галерея</h1>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === f ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground self-center">{filtered.length} файлов</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-3 gap-1.5">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`aspect-square rounded-lg ${item.bg} flex items-center justify-center text-2xl relative overflow-hidden group hover:opacity-90 transition-opacity`}
            >
              <span>{item.emoji}</span>
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                    <Icon name="Play" size={12} className="text-foreground ml-0.5" />
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 rounded-full p-2"
            onClick={() => setSelected(null)}
          >
            <Icon name="X" size={18} />
          </button>
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-sm w-full mx-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`aspect-square ${selectedItem.bg} flex items-center justify-center text-6xl`}>
              {selectedItem.emoji}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold">
                  {selectedItem.from[0]}
                </div>
                <div>
                  <div className="text-sm font-medium">{selectedItem.from}</div>
                  <div className="text-[11px] text-muted-foreground">{selectedItem.date}</div>
                </div>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${selectedItem.type === "video" ? "bg-secondary text-muted-foreground" : "bg-secondary text-muted-foreground"}`}>
                  {selectedItem.type === "video" ? "Видео" : "Фото"}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-foreground text-background text-sm py-2 rounded-lg font-medium">
                  <Icon name="Download" size={14} />
                  Скачать
                </button>
                <button className="flex items-center justify-center gap-1.5 bg-secondary text-foreground text-sm px-3 py-2 rounded-lg">
                  <Icon name="Share2" size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
