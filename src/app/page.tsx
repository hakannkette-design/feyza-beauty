"use client";
import { useState, useEffect, useRef } from "react";
export default function CustomerPage(){
  const [data,setData]=useState<any>(null);
  const [musteri,setMusteri]=useState<any>(null);
  const [tab,setTab]=useState<"randevu"|"islemler"|"beforeafter"|"dm">("randevu");
  const [randevuForm,setRandevuForm]=useState({islem:"", personel:"", saat:""});
  const [login,setLogin]=useState({kullanici:"", sifre:""});
  const [kayit,setKayit]=useState({ad:"", soyad:"", kullanici:"", sifre:"", telefon:""});
  const [mod,setMod]=useState<"login"|"kayit">("login");
  const [seciliDM,setSeciliDM]=useState<string|null>(null);
  const [mesajInput,setMesajInput]=useState("");
  const prevBildirim=useRef(0);
  const audioRef=useRef<HTMLAudioElement|null>(null);
  useEffect(()=>{
    const load=()=>{
      const s=localStorage.getItem("feyza_full_data_v2");
      if(s){
        const p=JSON.parse(s);
        p.personel=p.personel||[]; p.islemler=p.islemler||[]; p.beforeAfter=p.beforeAfter||[]; p.randevular=p.randevular||[]; p.chat=p.chat||[]; p.musteriler=p.musteriler||[]; p.bildirimler=p.bildirimler||[];
        if(musteri){
          const benim=(p.bildirimler||[]).filter((b:any)=> b.hedef===`${musteri.ad} ${musteri.soyad}`).length;
          if(benim>prevBildirim.current && prevBildirim.current!==0) audioRef.current?.play().catch(()=>{});
          prevBildirim.current=benim;
        }
        setData(p);
      } else setData({personel:[], islemler:[], beforeAfter:[], randevular:[], chat:[], musteriler:[], bildirimler:[], acik:true});
    };
    load(); const iv=setInterval(load,1000); return ()=>clearInterval(iv);
  },[musteri]);
  useEffect(()=>{
    const tel=localStorage.getItem("feyza_musteri_telefon");
    if(tel){
      const s=localStorage.getItem("feyza_full_data_v2");
      if(s){
        const p=JSON.parse(s);
        const m=p.musteriler?.find((x:any)=>x.telefon===tel);
        if(m) setMusteri(m);
      }
    }
  },[]);
  useEffect(()=>{ if(data) localStorage.setItem("feyza_full_data_v2", JSON.stringify(data)); },[data]);
  if(!data) return null;
  if(!musteri){
    return (
      <div className="min-h-screen bg-[#fdf2f8] flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white border border-[#fbcfe8] rounded-[24px] p-6 shadow-sm">
          <h1 className="text-center font-bold text-zinc-900 text-[16px]">Feyza Nur Hatipoğlu</h1>
          <p className="text-center text-[10px] tracking-[3px] text-[#db2777]/60 font-bold">BEAUTY</p>
          <div className="flex bg-[#fdf2f8] border border-[#fbcfe8] rounded-full p-1 mt-6">
            <button onClick={()=>setMod("login")} className={`flex-1 py-2 rounded-full text-xs font-bold ${mod==="login"? "bg-[#db2777] text-white":"text-zinc-600"}`}>Giriş Yap</button>
            <button onClick={()=>setMod("kayit")} className={`flex-1 py-2 rounded-full text-xs font-bold ${mod==="kayit"? "bg-[#db2777] text-white":"text-zinc-600"}`}>Kayıt Ol</button>
          </div>
          {mod==="kayit"? <>
            <p className="text-[11px] text-zinc-600 mt-4">Aynı telefonla sadece 1 hesap, kendi kaydını kendin yap</p>
            <div className="grid grid-cols-2 gap-2 mt-3"><input value={kayit.ad} onChange={e=>setKayit({...kayit, ad:e.target.value})} placeholder="İsim" className="bg-[#fdf2f8] border border-[#fbcfe8] rounded-full px-4 py-3 text-sm outline-none text-zinc-900" /><input value={kayit.soyad} onChange={e=>setKayit({...kayit, soyad:e.target.value})} placeholder="Soyisim" className="bg-[#fdf2f8] border border-[#fbcfe8] rounded-full px-4 py-3 text-sm outline-none text-zinc-900" /></div>
            <input value={kayit.kullanici} onChange={e=>setKayit({...kayit, kullanici:e.target.value})} placeholder="Kullanıcı adı" className="w-full bg-[#fdf2f8] border border-[#fbcfe8] rounded-full px-4 py-3 text-sm mt-2 outline-none text-zinc-900" />
            <input value={kayit.telefon} onChange={e=>setKayit({...kayit, telefon:e.target.value})} placeholder="Telefon 05xx" className="w-full bg-[#fdf2f8] border border-[#fbcfe8] rounded-full px-4 py-3 text-sm mt-2 outline-none text-zinc-900" />
            <input value={kayit.sifre} type="password" onChange={e=>setKayit({...kayit, sifre:e.target.value})} placeholder="Şifre" className="w-full bg-[#fdf2f8] border border-[#fbcfe8] rounded-full px-4 py-3 text-sm mt-2 outline-none text-zinc-900" />
            <button onClick={()=>{ if(!kayit.ad||!kayit.soyad||!kayit.kullanici||!kayit.sifre||!kayit.telefon) return alert("Doldur"); if(data.musteriler.find((m:any)=>m.telefon===kayit.telefon.trim())) return alert("Bu telefonla hesap var"); const yeni={id:Date.now(), ad:kayit.ad.trim(), soyad:kayit.soyad.trim(), kullanici:kayit.kullanici.trim(), sifre:kayit.sifre.trim(), telefon:kayit.telefon.trim()}; const yeniData={...data, musteriler:[...data.musteriler, yeni]}; setData(yeniData); localStorage.setItem("feyza_full_data_v2", JSON.stringify(yeniData)); localStorage.setItem("feyza_musteri_telefon", yeni.telefon); localStorage.setItem("feyza_musteri_adi", `${yeni.ad} ${yeni.soyad}`); setMusteri(yeni); }} className="w-full bg-[#db2777] text-white font-bold py-3 rounded-full mt-4 text-sm">Kayıt Ol</button>
          </> : <>
            <input value={login.kullanici} onChange={e=>setLogin({...login, kullanici:e.target.value})} placeholder="Kullanıcı adı veya Telefon" className="w-full bg-[#fdf2f8] border border-[#fbcfe8] rounded-full px-4 py-3 text-sm mt-6 outline-none text-zinc-900" />
            <input value={login.sifre} type="password" onChange={e=>setLogin({...login, sifre:e.target.value})} placeholder="Şifre" className="w-full bg-[#fdf2f8] border border-[#fbcfe8] rounded-full px-4 py-3 text-sm mt-3 outline-none text-zinc-900" />
            <button onClick={()=>{ const m=data.musteriler.find((x:any)=>(x.kullanici===login.kullanici.trim()||x.telefon===login.kullanici.trim()) && x.sifre===login.sifre.trim()); if(!m) return alert("Hatalı"); localStorage.setItem("feyza_musteri_telefon", m.telefon); localStorage.setItem("feyza_musteri_adi", `${m.ad} ${m.soyad}`); setMusteri(m); }} className="w-full bg-[#db2777] text-white font-bold py-3 rounded-full mt-4 text-sm">Giriş Yap</button>
          </>}
        </div>
      </div>
    );
  }
  const islemList=data.islemler||[]; const beforeAfterList=data.beforeAfter||[]; const personelList=data.personel||[];
  const tamAd=`${musteri.ad} ${musteri.soyad}`;
  const benimRandevular=(data.randevular||[]).filter((r:any)=>r.musteri===tamAd);
  const dmList:any={}; (data.chat||[]).filter((m:any)=>m.musteri===tamAd).forEach((m:any)=>{ if(!dmList[m.personel]) dmList[m.personel]={personel:m.personel, mesajlar:[]}; dmList[m.personel].mesajlar.push(m); });
  return (
    <div className="min-h-screen bg-[#fdf2f8] text-zinc-800">
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3" />
      <div className="max-w-[480px] mx-auto p-3 flex flex-col min-h-screen">
        <div className="bg-white border border-[#fbcfe8] rounded-[20px] p-4 flex justify-between items-center shadow-sm">
          <div className="leading-tight"><h1 className="font-bold text-[14px] text-zinc-900">Feyza Nur Hatipoğlu</h1><p className="font-bold text-[10px] tracking-[3px] text-[#db2777]/60">BEAUTY</p><p className="text-[11px] text-zinc-600 mt-1">{tamAd} • {musteri.telefon}</p></div>
          <button onClick={()=>{localStorage.removeItem("feyza_musteri_telefon"); localStorage.removeItem("feyza_musteri_adi"); setMusteri(null);}} className="text-[11px] text-zinc-500 border border-[#fbcfe8] px-3 py-1 rounded-full bg-white">Çıkış</button>
        </div>
        <div className="flex gap-2 overflow-x-auto py-4">
          {[{k:"randevu",a:"Randevu"},{k:"islemler",a:"İşlemler"},{k:"beforeafter",a:"Before/After"},{k:"dm",a:`DM (${Object.keys(dmList).length})`}].map((t:any)=><button key={t.k} onClick={()=>{setTab(t.k as any); setSeciliDM(null);}} className={`text-[11px] px-4 py-2.5 rounded-full border whitespace-nowrap font-medium ${tab===t.k? "bg-[#db2777] text-white border-[#db2777]":"bg-white border-[#fbcfe8] text-zinc-600"}`}>{t.a}</button>)}
        </div>
        <div className="flex-1">
          {tab==="islemler"&&<div className="space-y-3">{islemList.map((i:any)=><div key={i.id} className="bg-white border border-[#fbcfe8] p-4 rounded-[16px]"><div className="flex justify-between"><p className="text-sm font-bold text-zinc-900">{i.ad}</p><p className="text-sm font-bold text-[#be185d]">{i.fiyat}₺</p></div><p className="text-[12px] text-zinc-600 mt-2">{i.ad} için profesyonel uygulama.</p><button onClick={()=>{setRandevuForm({...randevuForm, islem:i.ad}); setTab("randevu");}} className="mt-3 w-full bg-[#fdf2f8] border border-[#fbcfe8] text-[#db2777] text-xs py-2.5 rounded-full font-bold">Randevu Al</button></div>)}</div>}
          {tab==="beforeafter"&&<div className="space-y-3">{beforeAfterList.map((b:any)=><div key={b.id} className="bg-white border border-[#fbcfe8] p-3 rounded-[20px]"><p className="text-sm font-bold text-zinc-900 mb-2">{b.islem}</p><div className="grid grid-cols-2 gap-2"><div><p className="text-[10px] text-zinc-500 font-bold">BEFORE</p><img src={b.before} className="w-full h-44 object-cover rounded-xl mt-1" /></div><div><p className="text-[10px] text-[#db2777] font-bold">AFTER</p><img src={b.after} className="w-full h-44 object-cover rounded-xl mt-1" /></div></div></div>)}</div>}
          {tab==="dm"&&<div>
            {!seciliDM? <div className="space-y-3"><div className="bg-white border border-[#fbcfe8] p-4 rounded-[16px]"><p className="font-bold text-xs text-zinc-900 mb-2">Feyza Nur Hatipoğlu ve Personeller</p><div className="grid grid-cols-1 gap-2"><button onClick={()=>setSeciliDM("Feyza Nur Hatipoğlu")} className="bg-[#db2777] text-white p-3 rounded-[16px] text-left flex justify-between"><div><p className="text-sm font-bold">Feyza Nur Hatipoğlu</p><p className="text-[11px] opacity-80">Admin</p></div><span className="text-xs">→</span></button>{personelList.map((p:any)=><button key={p.id} onClick={()=>setSeciliDM(p.ad)} className="bg-white border border-[#fbcfe8] p-3 rounded-[16px] text-left flex justify-between"><div><p className="text-sm font-bold text-zinc-900">{p.ad}</p><p className="text-[11px] text-zinc-500">Personel</p></div><span className="text-xs text-zinc-400">→</span></button>)}</div></div>{Object.values(dmList).map((dm:any)=><button key={dm.personel} onClick={()=>setSeciliDM(dm.personel)} className="w-full bg-white border border-[#fbcfe8] p-3 rounded-[16px] flex gap-3 text-left"><div className="w-10 h-10 rounded-full bg-[#db2777] text-white flex items-center justify-center font-bold text-sm">{dm.personel?.[0]}</div><div className="flex-1"><p className="text-sm font-bold text-zinc-900">{dm.personel}</p><p className="text-[11px] text-zinc-600 truncate">{dm.mesajlar[dm.mesajlar.length-1]?.mesaj}</p></div></button>)}</div>
            : <div className="flex flex-col h-[75vh] bg-white border border-[#fbcfe8] rounded-[20px] overflow-hidden">
              <div className="p-3 border-b border-[#fce7f3] flex items-center gap-3 bg-white"><button onClick={()=>setSeciliDM(null)} className="text-[#db2777] font-bold text-sm">← Geri</button><p className="text-sm font-bold text-zinc-900">{seciliDM}</p></div>
              <div className="flex-1 p-3 overflow-y-auto bg-[#fdf2f8] flex flex-col gap-3">
                {(dmList[seciliDM]?.mesajlar||[]).sort((a:any,b:any)=>new Date(a.zaman).getTime()-new Date(b.zaman).getTime()).map((m:any)=>{
                  const isMe = m.benden===true;
                  return (
                    <div key={m.id} className={`flex w-full flex-col ${isMe? "items-end":"items-start"}`}>
                      <p className={`text-[10px] font-bold mb-1 px-1 ${isMe? "text-[#db2777]":"text-zinc-500"}`}>{isMe? `Sen - ${tamAd}`: m.personel}</p>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-[18px] text-[13px] leading-[18px] shadow-sm ${isMe? "bg-[#db2777] text-white rounded-br-[4px]":"bg-white border border-[#fbcfe8] text-zinc-900 rounded-bl-[4px]"}`}>
                        <p className="whitespace-pre-wrap break-words">{m.mesaj}</p>
                        <p className={`text-[9px] mt-1 ${isMe? "text-white/70 text-right":"text-zinc-400 text-left"}`}>{new Date(m.zaman).toLocaleTimeString().slice(0,5)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 border-t border-[#fce7f3] flex gap-2 bg-white"><input value={mesajInput} onChange={e=>setMesajInput(e.target.value)} placeholder="Mesaj yaz..." className="flex-1 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full px-4 py-3 text-sm outline-none text-zinc-900" /><button onClick={()=>{ if(!mesajInput.trim()||!seciliDM) return; const yeni={id:Date.now(), musteri:tamAd, personel:seciliDM, mesaj:mesajInput.trim(), benden:true, zaman:new Date().toISOString()}; setData({...data, chat:[...data.chat, yeni]}); setMesajInput(""); }} className="bg-[#db2777] text-white px-6 rounded-full font-bold text-sm">Gönder</button></div>
            </div>}
          </div>}
          {tab==="randevu"&&<div className="space-y-3"><div className="bg-white border border-[#fbcfe8] p-4 rounded-[20px] space-y-3"><p className="font-bold text-sm text-zinc-900">Randevu Al</p><select value={randevuForm.islem} onChange={e=>setRandevuForm({...randevuForm, islem:e.target.value})} className="w-full bg-[#fdf2f8] border border-[#fbcfe8] rounded-full px-4 py-3 text-sm outline-none text-zinc-900"><option>İşlem Seç</option>{islemList.map((i:any)=><option key={i.id} value={i.ad}>{i.ad} - {i.fiyat}₺</option>)}</select><select value={randevuForm.personel} onChange={e=>setRandevuForm({...randevuForm, personel:e.target.value})} className="w-full bg-[#fdf2f8] border border-[#fbcfe8] rounded-full px-4 py-3 text-sm outline-none text-zinc-900"><option>Personel Seç</option><option value="Feyza Nur Hatipoğlu">Feyza Nur Hatipoğlu</option>{personelList.map((p:any)=><option key={p.id} value={p.ad}>{p.ad}</option>)}</select><input type="datetime-local" value={randevuForm.saat} onChange={e=>setRandevuForm({...randevuForm, saat:e.target.value})} className="w-full bg-[#fdf2f8] border border-[#fbcfe8] rounded-full px-4 py-3 text-sm outline-none text-zinc-900" /><button onClick={()=>{ if(!randevuForm.islem||!randevuForm.saat||!randevuForm.personel) return alert("Eksik"); const sec=new Date(randevuForm.saat); const cak=(data.randevular||[]).find((r:any)=>{ if(r.personel!==randevuForm.personel) return false; if(r.durum==="iptal") return false; return Math.abs(new Date(r.saat).getTime()-sec.getTime())/(1000*60)<90; }); if(cak) return alert("Bu saat dolu"); const islem=islemList.find((i:any)=>i.ad===randevuForm.islem); setData({...data, randevular:[...data.randevular, {id:Date.now(), musteri:tamAd, telefon:musteri.telefon, islem:randevuForm.islem, fiyat:islem?.fiyat||0, saat:randevuForm.saat, durum:"bekliyor", personel:randevuForm.personel}]}); alert("Randevu alındı!"); setRandevuForm({islem:"", personel:"", saat:""}); }} className="w-full bg-[#db2777] text-white font-bold py-3 rounded-full text-sm">Randevu Al</button></div><div className="bg-white border border-[#fbcfe8] p-4 rounded-[20px]"><p className="font-bold text-sm text-zinc-900 mb-2">Randevularım</p>{benimRandevular.map((r:any)=><div key={r.id} className="py-2 border-b border-[#fce7f3] last:border-0"><p className="text-sm font-bold text-zinc-900">{r.islem} - {r.fiyat}₺</p><p className="text-xs text-zinc-600">{new Date(r.saat).toLocaleString()} - {r.personel}</p><span className={`text-[10px] px-2 py-1 rounded-full font-bold ${r.durum==="onay"? "bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`}>{r.durum}</span></div>)}</div></div>}
        </div>
      </div>
    </div>
  );
}