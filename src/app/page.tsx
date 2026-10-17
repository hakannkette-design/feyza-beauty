"use client";
import { useState } from "react";

export default function Home() {
  const [tab, setTab] = useState("Randevular");
  const tabs = ["Randevular", "Müşteriler", "Personel", "İşlemler", "Before/After", "DM", "Ciro"];

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#1A1A1A] selection:bg-[#C9A89B]">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-[#FFFBF5]/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-black text-white grid place-items-center font-serif text-[18px]">F</div>
            <div>
              <h1 className="font-serif text-[18px] leading-none tracking-[0.14em]">FEYZA NUR</h1>
              <p className="text-[10px] tracking-[0.2em] opacity-60">BEAUTY ATELIER • KADIKÖY</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 h-9 rounded-full bg-white border border-black/5 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> AÇIK • 09:00 - 19:00
            </div>
            <div className="w-9 h-9 rounded-full bg-[#E8DDD6]"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-[24px] bg-white p-6 border border-black/5 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.15)]">
            <p className="text-[11px] tracking-widest opacity-50">TOPLAM MÜŞTERİ</p>
            <h2 className="font-serif text-4xl mt-2">128</h2>
            <p className="text-xs mt-3 text-emerald-600">↑ %18 bu ay</p>
          </div>
          <div className="rounded-[24px] bg-[#1A1A1A] text-white p-6 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.4)]">
            <p className="text-[11px] tracking-widest opacity-50">BU AY CİRO</p>
            <h2 className="font-serif text-4xl mt-2">47.500₺</h2>
            <p className="text-xs mt-3 text-[#C9A89B]">↑ %12 artış</p>
          </div>
          <div className="rounded-[24px] bg-[#F3E8E0] p-6 border border-black/5">
            <p className="text-[11px] tracking-widest opacity-50">BUGÜN RANDEVU</p>
            <h2 className="font-serif text-4xl mt-2">8</h2>
            <p className="text-xs mt-3 opacity-70">3 onay bekliyor</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_320px] gap-6">
          {/* SIDEBAR */}
          <div className="flex lg:flex-col gap-2 overflow-auto">
            {tabs.map(t => (
              <button key={t} onClick={()=>setTab(t)}
                className={`whitespace-nowrap px-5 h-11 rounded-full text-sm transition ${tab===t ? 'bg-black text-white' : 'bg-white border border-black/5 hover:border-black/20'}`}>
                {t} {t==="Müşteriler" && "(128)"}
              </button>
            ))}
          </div>

          {/* MAIN LIST */}
          <div className="rounded-[28px] bg-white border border-black/5 p-2 md:p-3">
            <div className="p-5 flex justify-between items-center">
              <h3 className="font-serif text-xl">Bugünün Randevuları</h3>
              <button className="h-9 px-4 rounded-full bg-[#1A1A1A] text-white text-xs">+ Yeni Randevu</button>
            </div>
            {[
              {saat:"10:00", isim:"Elif Yılmaz", islem:"Microblading", uzman:"Feyza", durum:"Geldi"},
              {saat:"11:30", isim:"Zeynep K.", islem:"Protez Tırnak", uzman:"Merve", durum:"Onaylandı"},
              {saat:"13:00", isim:"Ayşe Demir", islem:"İpek Kirpik", uzman:"Feyza", durum:"Bekliyor"},
              {saat:"14:30", isim:"Sude A.", islem:"Kalıcı Oje", uzman:"Merve", durum:"Onaylandı"},
            ].map((r,i)=>(
              <div key={i} className="group flex items-center justify-between p-5 rounded-[20px] hover:bg-[#FFFBF5] transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium opacity-50">{r.saat}</div>
                  <div className="w-10 h-10 rounded-full bg-[#F3E8E0] grid place-items-center font-serif">{r.isim[0]}</div>
                  <div>
                    <p className="text-sm font-medium">{r.isim}</p>
                    <p className="text-xs opacity-60">{r.islem} • {r.uzman}</p>
                  </div>
                </div>
                <span className={`text-[11px] px-3 h-7 grid place-items-center rounded-full ${r.durum==='Geldi'?'bg-emerald-50 text-emerald-700': r.durum==='Onaylandı'?'bg-black text-white':'bg-amber-50 text-amber-700'}`}>{r.durum}</span>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <div className="rounded-[24px] bg-white border border-black/5 p-6">
              <h4 className="font-serif mb-4">Hızlı İşlem</h4>
              <div className="grid grid-cols-2 gap-3">
                <button className="h-20 rounded-2xl bg-[#FFFBF5] border border-black/5 text-xs">Randevu<br/>Ekle</button>
                <button className="h-20 rounded-2xl bg-[#1A1A1A] text-white text-xs">DM<br/>Kutusu</button>
              </div>
            </div>
            <div className="rounded-[24px] bg-[#C9A89B] text-white p-6">
              <p className="text-xs tracking-widest opacity-70">GÜNÜN NOTU</p>
              <p className="font-serif text-lg mt-3 leading-snug">Bugün 2 VIP müşterin geliyor, ikramı unutma ✨</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}