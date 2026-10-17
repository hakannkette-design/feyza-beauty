"use client";
import { useState, useEffect, useRef } from "react";
export default function PersonelPage(){
  const [data,setData]=useState<any>(null);
  const [loginU,setLoginU]=useState(""); const [loginP,setLoginP]=useState("");
  const [personelAdi,setPersonelAdi]=useState("");
  const [tab,setTab]=useState<"randevu"|"beforeafter"|"musteriler"|"dm">("randevu");
  const [seciliDM,setSeciliDM]=useState<string|null>(null);
  const [mesajInput,setMesajInput]=useState("");
  const [seciliIslemBA,setSeciliIslemBA]=useState("");
  const [beforeTmp,setBeforeTmp]=useState<string|null>(null);
  const [afterTmp,setAfterTmp]=useState<string|null>(null);
  const prevChat=useRef(0);
  const audioRef=useRef<HTMLAudioElement|null>(null);
  useEffect(()=>{
    const ad=localStorage.getItem("feyza_personel_adi");
    if(ad) setPersonelAdi(ad);
    const load=()=>{
      const s=localStorage.getItem("feyza_full_data_v2");
      if(s){
        const p=JSON.parse(s);
        p.personel=p.personel||[]; p.islemler=p.islemler||[]; p.beforeAfter=p.beforeAfter||[]; p.randevular=p.randevular||[]; p.chat=p.chat||[]; p.musteriler=p.musteriler||[]; p.bildirimler=p.bildirimler||[];
        if(ad){
          const benim=(p.chat||[]).filter((m:any)=> m.personel===ad).length;
          if(benim>prevChat.current && prevChat.current!==0) audioRef.current?.play().catch(()=>{});
          prevChat.current=benim;
        }
        setData(p);
      } else setData({personel:[], islemler:[], beforeAfter:[], randevular:[], chat:[], musteriler:[], bildirimler:[]});
    };
    load(); const iv=setInterval(load,1000); return ()=>clearInterval(iv);
  },[personelAdi]);
  useEffect(()=>{ if(data) localStorage.setItem("feyza_full_data_v2", JSON.stringify(data)); },[data]);
  if(!data) return null;
  if(!personelAdi){
    return (
      <div className="min-h-screen bg-[#fdf2f8] flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white border border-[#fbcfe8] rounded-[24px] p-6 shadow-sm">
          <h1 className="text-center font-bold text-zinc-900">Personel Girişi</h1>
          <p className="text-center text-[10px] tracking-[3px] text-[#db2777]/60 font-bold">FEYZA BEAUTY</p>
          <input value={loginU} onChange={e=>setLoginU(e.target.value)} placeholder="Kullanıcı adı" className="w-full bg-[#fdf2f8] border border-[#fbcfe8] rounded-full px-4 py-3 text-sm mt-6 outline-none text-zinc-900" />
          <input value={loginP} type="password" onChange={e=>setLoginP(e.target.value)} placeholder="Şifre" className="w-full bg-[#fdf2f8] border border-[#fbcfe8] rounded-full px-4 py-3 text-sm mt-3 outline-none text-zinc-900" />
          <button onClick={()=>{ const p=(data.personel||[]).find((x:any)=> x.kullanici===loginU.trim() && x.sifre===loginP.trim()); if(!p) return alert("Hatalı"); localStorage.setItem("feyza_personel_adi", p.ad); setPersonelAdi(p.ad); }} className="w-full bg-[#db2777] text-white font-bold py-3 rounded-full mt-5 text-sm">Giriş Yap</button>
        </div>
      </div>
    );
  }
  const ben=data.personel.find((p:any)=>p.ad===personelAdi);
  const islemList=data.islemler||[]; const beforeAfterList=data.beforeAfter||[];
  const benimRandevular=(data.randevular||[]).filter((r:any)=> r.personel===personelAdi);
  const buAy=new Date().getMonth(); const buYil=new Date().getFullYear();
  const buAyOnay=benimRandevular.filter((r:any)=> r.durum==="onay" && new Date(r.saat).getMonth()===buAy && new Date(r.saat).getFullYear()===buYil);
  const buAyCiro=buAyOnay.reduce((a:any,b:any)=>a+Number(b.fiyat||0),0);
  const dmList:any={}; (data.chat||[]).filter((m:any)=> m.personel===personelAdi).forEach((m:any)=>{ if(!dmList[m.musteri]) dmList[m.musteri]={musteri:m.musteri, mesajlar:[]}; dmList[m.musteri].mesajlar.push(m); });
  return (
    <div className="min-h-screen bg-[#fdf2f8] text-zinc-800">
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3" />
      <div className="max-w-[520px] mx-auto p-3">
        <div className="bg-white border border-[#fbcfe8] rounded-[20px] p-4 flex justify-between items-center shadow-sm">
          <div className="leading-tight"><h1 className="font-bold text-[14px] text-zinc-900">{personelAdi}</h1><p className="text-[10px] tracking-[2px] text-[#db2777]/60 font-bold">PERSONEL</p><p className="text-[12px] text-zinc-700 mt-1">Bu Ay: {buAyOnay.length} randevu - {buAyCiro}₺</p><p className="text-[11px] text-zinc-500">Toplam Müşteri: {data.musteriler?.length||0}</p></div>
          <div className="flex flex-col gap-2 items-end"><button onClick={()=>setData({...data, personel:data.personel.map((p:any)=>p.ad===personelAdi? {...p, dukkanda:!p.dukkanda}:p)})} className={`px-4 py-2 rounded-full text-xs font-bold text-white ${ben?.dukkanda? "bg-green-600":"bg-zinc-400"}`}>{ben?.dukkanda? "DÜKKANDAYIM":"DEĞİLİM"}</button><button onClick={()=>{localStorage.removeItem("feyza_personel_adi"); setPersonelAdi("");}} className="text-[11px] text-zinc-500">Çıkış</button></div>
        </div>
        <div className="flex gap-2 overflow-x-auto py-4">
          {[{k:"randevu",a:`Randevularım (${benimRandevular.length})`},{k:"beforeafter",a:"Before/After"},{k:"musteriler",a:`Müşteriler (${data.musteriler?.length||0})`},{k:"dm",a:`DM (${Object.keys(dmList).length})`}].map((t:any)=><button key={t.k} onClick={()=>{setTab(t.k as any); setSeciliDM(null);}} className={`text-[11px] px-4 py-2.5 rounded-full border whitespace-nowrap font-medium ${tab===t.k? "bg-[#db2777] text-white border-[#db2777]":"bg-white border-[#fbcfe8] text-zinc-600"}`}>{t.a}</button>)}
        </div>
        {tab==="musteriler"&&<div className="bg-white border border-[#fbcfe8] p-4 rounded-[20px]"><p className="font-bold text-sm text-zinc-900">Müşteri Listesi - Sadece Görürsün</p><p className="text-[12px] font-bold text-[#db2777] mt-2">Toplam: {data.musteriler?.length||0} müşteri - Yeni müşteri eklenince otomatik artar</p><div className="mt-3 space-y-2">{data.musteriler?.map((m:any)=><div key={m.id} className="py-2.5 border-b border-[#fce7f3] last:border-0"><p className="text-sm font-bold text-zinc-900">{m.ad} {m.soyad} - @{m.kullanici}</p><p className="text-[11px] text-zinc-600">📞 {m.telefon}</p></div>)}{data.musteriler?.length===0&&<p className="text-xs text-zinc-500 text-center py-4">Henüz yok</p>}</div></div>}
        {tab==="randevu"&&<div className="space-y-3"><div className="bg-white border border-[#fbcfe8] p-4 rounded-[20px]"><p className="font-bold text-sm text-zinc-900">İstatistik - Sadece Kendin</p><p className="text-2xl font-bold text-[#be185d] mt-2">{buAyCiro}₺</p><p className="text-sm text-zinc-700">Bu ay {buAyOnay.length} randevu onayladın</p></div>{benimRandevular.map((r:any)=><div key={r.id} className="bg-white border border-[#fbcfe8] p-4 rounded-[16px]"><p className="text-sm font-bold text-zinc-900">{r.musteri} - {r.islem} - {r.fiyat}₺</p><p className="text-xs text-zinc-600">{new Date(r.saat).toLocaleString()} - {r.durum}</p><div className="flex gap-2 mt-3"><button onClick={()=>setData({...data, randevular:data.randevular.map((x:any)=>x.id===r.id? {...x, durum:"onay"}:x)})} className="bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold">Onayla</button><button onClick={()=>setData({...data, randevular:data.randevular.filter((x:any)=>x.id!==r.id)})} className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold">İptal</button></div></div>)}</div>}
        {tab==="beforeafter"&&<div className="space-y-3"><div className="bg-white border border-[#fbcfe8] p-4 rounded-[20px] space-y-3"><p className="font-bold text-sm text-zinc-900">Before / After Ekle</p><select value={seciliIslemBA} onChange={e=>setSeciliIslemBA(e.target.value)} className="w-full bg-[#fdf2f8] border border-[#fbcfe8] rounded-full px-4 py-3 text-sm outline-none text-zinc-900"><option value="">İşlem seç</option>{islemList.map((i:any)=><option key={i.id} value={i.ad}>{i.ad} - {i.fiyat}₺</option>)}</select>{seciliIslemBA&&<div className="grid grid-cols-2 gap-3"><div><p className="text-[11px] font-bold text-zinc-700 mb-1">BEFORE</p><input type="file" accept="image/*" onChange={e=>{ const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>setBeforeTmp(r.result as string); r.readAsDataURL(f); }} className="text-[11px]" />{beforeTmp&&<img src={beforeTmp} className="w-full h-28 object-cover rounded-xl mt-2 border border-[#fbcfe8]" />}</div><div><p className="text-[11px] font-bold text-[#db2777] mb-1">AFTER</p><input type="file" accept="image/*" onChange={e=>{ const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>setAfterTmp(r.result as string); r.readAsDataURL(f); }} className="text-[11px]" />{afterTmp&&<img src={afterTmp} className="w-full h-28 object-cover rounded-xl mt-2 border border-[#fbcfe8]" />}</div></div>}<button onClick={()=>{ if(!seciliIslemBA||!beforeTmp||!afterTmp) return alert("Eksik"); setData({...data, beforeAfter:[...data.beforeAfter, {id:Date.now(), islem:seciliIslemBA, before:beforeTmp, after:afterTmp}]}); setBeforeTmp(null); setAfterTmp(null); setSeciliIslemBA(""); }} className="w-full bg-[#db2777] text-white font-bold py-3 rounded-full text-sm">Kaydet</button></div>{beforeAfterList.map((b:any)=><div key={b.id} className="bg-white border border-[#fbcfe8] p-3 rounded-[20px]"><p className="text-sm font-bold text-zinc-900 mb-2">{b.islem}</p><div className="grid grid-cols-2 gap-2"><img src={b.before} className="w-full h-36 object-cover rounded-xl" /><img src={b.after} className="w-full h-36 object-cover rounded-xl" /></div><button onClick={()=>setData({...data, beforeAfter:data.beforeAfter.filter((x:any)=>x.id!==b.id)})} className="text-red-500 text-xs font-bold mt-2">Sil</button></div>)}</div>}
        {tab==="dm"&&<div className="space-y-3">
          {!seciliDM? <div className="space-y-2"><div className="flex justify-between items-center"><p className="font-bold text-sm text-zinc-900">Müşteriler + Adminle Sohbet</p><button onClick={()=>{ if(confirm("Tüm DM temizlensin mi?")) setData({...data, chat:data.chat.filter((m:any)=>m.personel!==personelAdi)}); }} className="text-xs text-red-500 font-bold border border-red-200 px-3 py-1 rounded-full bg-white">Tümünü Temizle</button></div><button onClick={()=>setSeciliDM("Feyza Nur Hatipoğlu")} className="w-full bg-[#db2777] text-white p-3 rounded-[16px] text-left"><p className="text-sm font-bold">Feyza Nur Hatipoğlu</p><p className="text-[11px] opacity-80">Admin</p></button>{Object.values(dmList).map((dm:any)=><div key={dm.musteri} className="bg-white border border-[#fbcfe8] p-3 rounded-[16px] flex justify-between items-center"><button onClick={()=>setSeciliDM(dm.musteri)} className="text-left flex-1"><p className="text-sm font-bold text-zinc-900">{dm.musteri}</p><p className="text-[11px] text-zinc-600 truncate">{dm.mesajlar[dm.mesajlar.length-1]?.mesaj}</p></button><button onClick={()=>setData({...data, chat:data.chat.filter((m:any)=>!(m.personel===personelAdi && m.musteri===dm.musteri))})} className="text-[10px] text-red-500 font-bold ml-2">Temizle</button></div>)}</div>
          : <div className="flex flex-col h-[75vh] bg-white border border-[#fbcfe8] rounded-[20px] overflow-hidden">
              <div className="p-3 border-b border-[#fce7f3] flex justify-between items-center bg-white"><div className="flex gap-2 items-center"><button onClick={()=>setSeciliDM(null)} className="text-[#db2777] font-bold text-sm">← Geri</button><p className="text-sm font-bold text-zinc-900">{seciliDM}</p></div><button onClick={()=>{ setData({...data, chat:data.chat.filter((m:any)=>!(m.personel===personelAdi && m.musteri===seciliDM))}); setSeciliDM(null); }} className="text-[11px] text-red-500 font-bold border border-red-200 px-3 py-1 rounded-full">Bu Sohbeti Temizle</button></div>
              <div className="flex-1 p-3 overflow-y-auto bg-[#fdf2f8] flex flex-col gap-3">
                {(dmList[seciliDM]?.mesajlar||[]).sort((a:any,b:any)=>new Date(a.zaman).getTime()-new Date(b.zaman).getTime()).map((m:any)=>{
                  const isMe = m.benden===true;
                  return (
                    <div key={m.id} className={`flex w-full flex-col ${isMe? "items-end":"items-start"}`}>
                      <p className={`text-[10px] font-bold mb-1 px-1 ${isMe? "text-[#db2777]":"text-zinc-500"}`}>{isMe? `Sen - ${personelAdi}`: m.musteri}</p>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-[18px] text-[13px] leading-[18px] shadow-sm ${isMe? "bg-[#db2777] text-white rounded-br-[4px]":"bg-white border border-[#fbcfe8] text-zinc-900 rounded-bl-[4px]"}`}>
                        <p className="whitespace-pre-wrap break-words">{m.mesaj}</p>
                        <p className={`text-[9px] mt-1 ${isMe? "text-white/70 text-right":"text-zinc-400 text-left"}`}>{new Date(m.zaman).toLocaleTimeString().slice(0,5)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 border-t border-[#fce7f3] flex gap-2 bg-white"><input value={mesajInput} onChange={e=>setMesajInput(e.target.value)} placeholder="Mesaj yaz..." className="flex-1 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full px-4 py-3 text-sm outline-none text-zinc-900" /><button onClick={()=>{ if(!mesajInput.trim()||!seciliDM) return; const yeni={id:Date.now(), musteri:seciliDM==="Feyza Nur Hatipoğlu"? personelAdi: seciliDM, personel:seciliDM==="Feyza Nur Hatipoğlu"? "Feyza Nur Hatipoğlu": personelAdi, mesaj:mesajInput.trim(), benden:seciliDM!=="Feyza Nur Hatipoğlu", zaman:new Date().toISOString()}; const yeni2=seciliDM!=="Feyza Nur Hatipoğlu"? {id:Date.now(), musteri:seciliDM, personel:personelAdi, mesaj:mesajInput.trim(), benden:true, zaman:new Date().toISOString()}: yeni; setData({...data, chat:[...data.chat, yeni2]}); setMesajInput(""); }} className="bg-[#db2777] text-white px-6 rounded-full font-bold text-sm">Gönder</button></div>
            </div>}
        </div>}
      </div>
    </div>
  );
}