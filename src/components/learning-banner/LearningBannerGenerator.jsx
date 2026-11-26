"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, ImagePlus, Sparkles, ZoomIn, ZoomOut } from "lucide-react";
import { calculateSquareCrop } from "@/lib/image-crop";

const topics = ["Japanese", "German", "English", "Bangla", "Korean", "Arabic", "Chinese", "Grammar & Vocabulary", "Exam Preparation", "JavaScript", "Python", "React", "Next.js", "HTML", "CSS", "C++", "Java", "AI / ML"];
const templates = [
  { id: "developer", label: "Modern Developer", note: "Bold & focused" },
  { id: "minimal", label: "Minimal Learning Journey", note: "Calm & considered" },
  { id: "creative", label: "Creative Student", note: "Bright & expressive" },
];
const themes = [
  { id: "midnight", label: "Midnight", swatch: "#10283f" },
  { id: "paper", label: "Paper", swatch: "#f5f0e8" },
  { id: "sunrise", label: "Sunrise", swatch: "#d96822" },
  { id: "lavender", label: "Lavender", swatch: "#554c83" },
];

function BannerArtwork({ form, photo, bannerRef }) {
  const dark = form.theme !== "paper";
  const palette = {
    midnight: { bg: "linear-gradient(120deg,#10283f 0%,#163b5b 58%,#255071 100%)", fg: "#fff", muted: "#d9e5ee", accent: "#f8913e", orb: "rgba(232,120,23,.34)" },
    paper: { bg: "linear-gradient(125deg,#fbf8f1,#eee7da)", fg: "#172b3e", muted: "#586b7b", accent: "#cf6410", orb: "rgba(207,100,16,.13)" },
    sunrise: { bg: "linear-gradient(125deg,#b94a1c,#e87817 60%,#f4a54f)", fg: "#fff", muted: "#fff0df", accent: "#ffe2b8", orb: "rgba(255,255,255,.17)" },
    lavender: { bg: "linear-gradient(125deg,#302b53,#554c83 60%,#8071a8)", fg: "#fff", muted: "#e6e1f3", accent: "#ffc181", orb: "rgba(232,120,23,.27)" },
  }[form.theme];
  const name = form.name.trim() || "Your name";
  const day = form.day.trim() || "01";
  const topic = form.topic || "Choose your topic";
  const dept = form.department.trim();
  const goal = form.goal.trim();
  const isMinimal = form.template === "minimal";
  const isCreative = form.template === "creative";
  const imageSide = isMinimal ? "left" : "right";
  const imageFrame = isCreative ? "rounded-[2.5rem] rotate-3" : isMinimal ? "rounded-2xl" : "rounded-full";

  return (
    <div ref={bannerRef} data-banner-canvas className={`relative isolate flex h-[630px] w-[1200px] overflow-hidden ${isMinimal ? "items-center" : "items-stretch"}`} style={{ background: palette.bg, color: palette.fg, fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div aria-hidden="true" className="absolute -right-24 -top-32 h-[530px] w-[530px] rounded-full" style={{ background: palette.orb }} />
      {isCreative && <div aria-hidden="true" className="absolute -bottom-48 -left-24 h-[430px] w-[700px] -rotate-12 rounded-[50%]" style={{ background: "rgba(255,255,255,.11)" }} />}
      {form.template === "developer" && <div aria-hidden="true" className="absolute inset-0 opacity-[.12]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.25) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />}
      <div className={`relative z-10 flex w-full items-center ${imageSide === "left" ? "flex-row-reverse" : ""} px-[82px]`}>
        <div className={`flex w-[68%] flex-col ${isMinimal ? "pl-12" : ""}`}>
          <div className="mb-8 flex items-center gap-3">
            <span className="rounded-full px-4 py-2 text-[18px] font-bold tracking-[.12em]" style={{ background: dark ? "rgba(255,255,255,.13)" : "rgba(16,40,63,.08)", color: palette.accent }}>LEARNING JOURNEY</span>
            {dept && <span className="text-[20px] font-medium" style={{ color: palette.muted }}>{dept}</span>}
          </div>
          <p className="mb-2 text-[21px] font-semibold uppercase tracking-[.18em]" style={{ color: palette.muted }}>Day</p>
          <div className="flex items-end gap-5">
            <span className={`${isMinimal ? "text-[105px]" : "text-[118px]"} font-black leading-[.95] tracking-[-.06em]`} style={{ color: palette.accent }}>{day.slice(0, 5)}</span>
            <span className="mb-4 text-[35px] font-semibold" style={{ color: palette.muted }}>of becoming</span>
          </div>
          <h2 className={`${isCreative ? "text-[62px]" : "text-[58px]"} mt-8 max-w-[720px] font-extrabold leading-[1.05] tracking-[-.035em]`}>{name}</h2>
          <div className="mt-5 inline-flex w-fit max-w-[690px] items-center gap-3 rounded-2xl px-5 py-3" style={{ background: dark ? "rgba(255,255,255,.13)" : "rgba(16,40,63,.08)" }}>
            <Sparkles size={22} color={palette.accent} />
            <span className="truncate text-[28px] font-bold">Learning {topic}</span>
          </div>
          {goal && <p className="mt-6 max-w-[700px] text-[24px] leading-snug" style={{ color: palette.muted }}>“{goal.slice(0, 105)}”</p>}
        </div>
        <div className="flex w-[32%] justify-center">
          <div className={`relative flex h-[285px] w-[285px] items-center justify-center overflow-hidden border-[9px] shadow-2xl ${imageFrame}`} style={{ borderColor: dark ? "rgba(255,255,255,.8)" : "rgba(16,40,63,.15)", background: dark ? "rgba(255,255,255,.15)" : "rgba(16,40,63,.07)" }}>
            {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : <span className="text-[120px] font-bold" style={{ color: palette.accent }}>{name === "Your name" ? "✦" : name[0].toUpperCase()}</span>}
            {isCreative && <span className="absolute -bottom-2 -right-2 rounded-full px-5 py-2 text-[18px] font-bold" style={{ background: "#fff", color: "#10283f" }}>KEEP GOING</span>}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-20 flex h-[92px] items-center justify-between border-t px-[82px]" style={{ borderColor: dark ? "rgba(255,255,255,.2)" : "rgba(16,40,63,.12)", background: dark ? "rgba(7,22,35,.24)" : "rgba(255,255,255,.45)" }}>
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}<img src="/as-books-house-logo.jpg" alt="AS Books House" className="h-12 w-12 rounded-xl object-cover" />
          <div><p className="text-[18px] font-bold">Made with AS Books House</p><p className="mt-1 text-[14px]" style={{ color: palette.muted }}>Find your next learning book at AS Books House</p></div>
        </div>
        <span className="text-[17px] font-semibold tracking-wide" style={{ color: palette.muted }}>asbookshouse.com</span>
      </div>
    </div>
  );
}

function ImageCropDialog({ image, onCancel, onConfirm }) {
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 480, height: 360 });
  const [zoom, setZoom] = useState(1);
  const longestSide = Math.max(image.width, image.height);
  const cropSide = longestSide / zoom;
  const minX = Math.min(0, image.width - cropSide);
  const maxX = Math.max(0, image.width - cropSide);
  const minY = Math.min(0, image.height - cropSide);
  const maxY = Math.max(0, image.height - cropSide);
  const [position, setPosition] = useState({ x: (image.width - cropSide) / 2, y: (image.height - cropSide) / 2 });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const imageScale = Math.min(stageSize.width / image.width, stageSize.height / image.height);
  const imageLeft = (stageSize.width - image.width * imageScale) / 2;
  const imageTop = (stageSize.height - image.height * imageScale) / 2;
  const frameSize = cropSide * imageScale;

  useEffect(() => {
    if (!stageRef.current) return;
    const observer = new ResizeObserver(([entry]) => setStageSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  const clampPosition = (x, y, side = cropSide) => {
    const left = Math.min(0, image.width - side);
    const right = Math.max(0, image.width - side);
    const top = Math.min(0, image.height - side);
    const bottom = Math.max(0, image.height - side);
    return { x: Math.max(left, Math.min(right, x)), y: Math.max(top, Math.min(bottom, y)) };
  };
  const startMove = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, originX: position.x, originY: position.y };
  };
  const move = (event) => {
    if (!dragRef.current || dragRef.current.id !== event.pointerId) return;
    const start = dragRef.current;
    setPosition(clampPosition(start.originX + (event.clientX - start.x) / imageScale, start.originY + (event.clientY - start.y) / imageScale));
  };
  const changeZoom = (nextZoom) => {
    const boundedZoom = Math.max(0.5, Math.min(3, nextZoom));
    const centerX = position.x + cropSide / 2;
    const centerY = position.y + cropSide / 2;
    const nextSide = longestSide / boundedZoom;
    setZoom(boundedZoom);
    setPosition(clampPosition(centerX - nextSide / 2, centerY - nextSide / 2, nextSide));
  };
  const reset = () => {
    const resetZoom = 1;
    const side = longestSide / resetZoom;
    setZoom(resetZoom);
    setPosition({ x: (image.width - side) / 2, y: (image.height - side) / 2 });
  };
  const confirm = async () => {
    setSaving(true); setError("");
    try {
      const source = new window.Image();
      source.src = image.src;
      await source.decode();
      const canvas = document.createElement("canvas");
      canvas.width = 1200; canvas.height = 1200;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable");
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      const cropRect = calculateSquareCrop(image.width, image.height, zoom, position);
      context.fillStyle = "#e9edf1";
      context.fillRect(0, 0, 1200, 1200);
      context.drawImage(source, -cropRect.x / cropRect.width * 1200, -cropRect.y / cropRect.height * 1200, image.width / cropRect.width * 1200, image.height / cropRect.height * 1200);
      onConfirm(canvas.toDataURL("image/png"));
    } catch {
      setError("We couldn’t apply this crop. Please reset or choose another image.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071725]/75 p-3 backdrop-blur-sm sm:p-6" role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="crop-dialog-title" className="max-h-[96vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-4"><div><h2 id="crop-dialog-title" className="text-xl font-bold text-[#10283f] sm:text-2xl">Position your photo</h2><p className="mt-1 text-sm text-slate-600">Your full photo is shown. Drag the square over the area to include in your banner.</p></div><button type="button" onClick={onCancel} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100" aria-label="Cancel photo crop">Cancel</button></div>
        <div ref={stageRef} className="relative mx-auto aspect-[4/3] w-full max-w-[560px] touch-none overflow-hidden rounded-2xl bg-[#e9edf1]" aria-label="Full uploaded photo with movable crop frame">
          <img src={image.src} alt="Full uploaded photo" draggable="false" className="pointer-events-none absolute max-w-none select-none" style={{ left: imageLeft, top: imageTop, width: image.width * imageScale, height: image.height * imageScale }} />
          <div onPointerDown={startMove} onPointerMove={move} onPointerUp={() => { dragRef.current = null; }} onPointerCancel={() => { dragRef.current = null; }} onLostPointerCapture={() => { dragRef.current = null; }} role="slider" aria-label="Move square crop area" aria-valuetext={`Crop position ${Math.round(position.x)}, ${Math.round(position.y)}`} tabIndex={0} onKeyDown={(event) => { const step = longestSide / 30; if (event.key === "ArrowLeft") setPosition((p) => clampPosition(p.x - step, p.y)); if (event.key === "ArrowRight") setPosition((p) => clampPosition(p.x + step, p.y)); if (event.key === "ArrowUp") setPosition((p) => clampPosition(p.x, p.y - step)); if (event.key === "ArrowDown") setPosition((p) => clampPosition(p.x, p.y + step)); }} className="absolute cursor-move touch-none border-2 border-white shadow-[0_0_0_999px_rgba(7,23,37,.48)] outline-none focus-visible:ring-4 focus-visible:ring-orange-400" style={{ left: imageLeft + position.x * imageScale, top: imageTop + position.y * imageScale, width: frameSize, height: frameSize, backgroundImage: "linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.25) 1px,transparent 1px)", backgroundSize: "33.33% 33.33%" }}><span className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#10283f]/85 px-3 py-1 text-xs font-bold text-white">BANNER CROP</span></div>
        </div>
        <div className="mx-auto mt-4 max-w-[560px]"><div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><label htmlFor="crop-zoom" className="mb-2 block text-sm font-semibold text-slate-700">Zoom <span className="font-normal text-slate-500">{zoom.toFixed(1)}×</span></label><div className="flex items-center gap-3"><button type="button" onClick={() => changeZoom(zoom - 0.15)} disabled={zoom <= 0.5} aria-label="Zoom out" className="rounded-lg border border-slate-300 p-2 text-[#10283f] hover:bg-slate-50 disabled:opacity-40"><ZoomOut size={18} /></button><input id="crop-zoom" aria-label="Zoom photo crop" type="range" min="0.5" max="3" step="0.05" value={zoom} onChange={(event) => changeZoom(Number(event.target.value))} className="w-full accent-[#cf6410]" /><button type="button" onClick={() => changeZoom(zoom + 0.15)} disabled={zoom >= 3} aria-label="Zoom in" className="rounded-lg border border-slate-300 p-2 text-[#10283f] hover:bg-slate-50 disabled:opacity-40"><ZoomIn size={18} /></button></div></div><button type="button" onClick={reset} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#cf6410] hover:text-[#a84e0d]">Reset</button></div>
          <div className="mt-4 grid grid-cols-2 gap-4"><label className="text-xs font-semibold text-slate-700">Horizontal position<input aria-label="Horizontal crop position" type="range" min="0" max="1" step="0.001" value={((position.x - minX) / Math.max(1, maxX - minX)).toFixed(3)} onChange={(event) => setPosition((p) => clampPosition(minX + (maxX - minX) * Number(event.target.value), p.y))} className="mt-2 block w-full accent-[#cf6410]" /></label><label className="text-xs font-semibold text-slate-700">Vertical position<input aria-label="Vertical crop position" type="range" min="0" max="1" step="0.001" value={((position.y - minY) / Math.max(1, maxY - minY)).toFixed(3)} onChange={(event) => setPosition((p) => clampPosition(p.x, minY + (maxY - minY) * Number(event.target.value)))} className="mt-2 block w-full accent-[#cf6410]" /></label></div>
        </div>
        {error && <p role="alert" className="mx-auto mt-3 max-w-[560px] text-sm text-red-700">{error}</p>}
        <div className="mx-auto mt-5 flex max-w-[560px] flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onCancel} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button><button type="button" onClick={confirm} disabled={saving} className="rounded-xl bg-[#cf6410] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#b7540d] disabled:opacity-60">{saving ? "Applying crop…" : "Confirm Crop"}</button></div>
      </section>
    </div>
  );
}

export default function LearningBannerGenerator() {
  const [form, setForm] = useState({ topic: "", name: "", department: "", goal: "", day: "01", template: "developer", theme: "midnight" });
  const [photo, setPhoto] = useState("");
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [scale, setScale] = useState(1);
  const frameRef = useRef(null);
  const bannerRef = useRef(null);

  useEffect(() => {
    if (!frameRef.current) return;
    const observer = new ResizeObserver(([entry]) => setScale(Math.min(entry.contentRect.width / 1200, 1)));
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, []);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const onPhoto = (event) => {
    const file = event.target.files?.[0];
    setPhotoError("");
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Choose a JPG, PNG or WebP image."); event.target.value = ""; return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Your photo must be smaller than 5 MB."); event.target.value = ""; return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setPhotoError("That image could not be read. Try another file.");
        return;
      }
      const preview = new window.Image();
      preview.onload = () => {
        setPendingPhoto({ src: reader.result, width: preview.naturalWidth, height: preview.naturalHeight });
      };
      preview.onerror = () => setPhotoError("That image could not be opened. Try another JPG, PNG or WebP image.");
      preview.src = reader.result;
    };
    reader.onerror = () => setPhotoError("That image could not be read. Try another file.");
    reader.readAsDataURL(file);
  };

  const download = async () => {
    if (!form.topic || !bannerRef.current) return;
    setDownloading(true); setDownloadError("");
    try {
      await document.fonts?.ready;
      const images = [...bannerRef.current.querySelectorAll("img")];
      await Promise.all(images.map((image) => image.decode().catch(() => {})));
      const png = await toPng(bannerRef.current, { width: 1200, height: 630, pixelRatio: 1, cacheBust: true });
      const link = document.createElement("a");
      link.download = "as-books-house-learning-journey.png";
      link.href = png;
      link.click();
    } catch (error) {
      console.error("Banner export failed", error);
      setDownloadError("We couldn’t create the PNG just now. Please try again.");
    } finally { setDownloading(false); }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f6f8fa] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-9 max-w-3xl">
          <p className="mb-2 text-sm font-bold uppercase tracking-[.16em] text-[#cf6410]">A little progress, worth sharing</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#10283f] sm:text-4xl">Make your learning journey visible.</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">Build a personal banner for the topic you’re learning. Your preview updates as you create, and your design stays right here in your browser.</p>
        </header>

        <div className="grid items-start gap-7 xl:grid-cols-[360px_minmax(0,1fr)]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="customize-title">
            <h2 id="customize-title" className="mb-5 text-xl font-bold text-[#10283f]">Customize your banner</h2>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">What are you learning? <span className="text-[#cf6410]">*</span>
                <select value={form.topic} onChange={update("topic")} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-normal outline-none focus:border-[#cf6410] focus:ring-2 focus:ring-orange-100">
                  <option value="">Select a topic</option>{topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold text-slate-700">Your name<input value={form.name} onChange={update("name")} maxLength={40} placeholder="e.g. Ayesha Rahman" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal outline-none placeholder:text-slate-400 focus:border-[#cf6410] focus:ring-2 focus:ring-orange-100" /></label>
              <label className="block text-sm font-semibold text-slate-700">Department<input value={form.department} onChange={update("department")} maxLength={45} placeholder="e.g. Computer Science" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal outline-none placeholder:text-slate-400 focus:border-[#cf6410] focus:ring-2 focus:ring-orange-100" /></label>
              <label className="block text-sm font-semibold text-slate-700">Your learning goal<textarea value={form.goal} onChange={update("goal")} maxLength={105} rows={2} placeholder="e.g. One small step every day" className="mt-1.5 w-full resize-y rounded-xl border border-slate-300 px-3 py-3 font-normal outline-none placeholder:text-slate-400 focus:border-[#cf6410] focus:ring-2 focus:ring-orange-100" /></label>
              <label className="block text-sm font-semibold text-slate-700">Learning day<input value={form.day} onChange={update("day")} maxLength={5} placeholder="01" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal outline-none placeholder:text-slate-400 focus:border-[#cf6410] focus:ring-2 focus:ring-orange-100" /></label>
              <div><span className="block text-sm font-semibold text-slate-700">Profile photo <span className="font-normal text-slate-500">(optional)</span></span><label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-3 text-sm font-semibold text-[#31577f] transition hover:border-[#cf6410] hover:bg-orange-50"><ImagePlus size={18} /> {photo ? "Choose a different photo" : "Upload JPG, PNG or WebP"} <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onPhoto} className="sr-only" /></label><p className="mt-1 text-xs text-slate-500">Maximum file size: 5 MB. You can position it before it appears on the banner.</p>{photoError && <p role="alert" className="mt-1 text-sm text-red-700">{photoError}</p>}{photo && <p className="mt-2 text-xs font-medium text-emerald-700">Photo crop confirmed and shown in the live preview.</p>}</div>
              <fieldset><legend className="mb-2 text-sm font-semibold text-slate-700">Choose a template</legend><div className="space-y-2">{templates.map((template) => <label key={template.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${form.template === template.id ? "border-[#e87817] bg-orange-50/70 ring-1 ring-[#e87817]/30" : "border-slate-200 hover:border-slate-300"}`}><input type="radio" name="template" value={template.id} checked={form.template === template.id} onChange={update("template")} className="mt-1 accent-[#cf6410]" /><span><span className="block text-sm font-semibold text-slate-800">{template.label}</span><span className="text-xs text-slate-500">{template.note}</span></span></label>)}</div></fieldset>
              <fieldset><legend className="mb-2 text-sm font-semibold text-slate-700">Background theme</legend><div className="flex flex-wrap gap-2">{themes.map((theme) => <button type="button" key={theme.id} onClick={() => setForm((current) => ({ ...current, theme: theme.id }))} aria-pressed={form.theme === theme.id} className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${form.theme === theme.id ? "border-[#10283f] ring-2 ring-[#10283f]/15" : "border-slate-200 hover:border-slate-400"}`}><span className="h-4 w-4 rounded-full" style={{ background: theme.swatch }} />{theme.label}</button>)}</div></fieldset>
            </div>
          </section>

          <section className="min-w-0" aria-labelledby="preview-title">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h2 id="preview-title" className="text-xl font-bold text-[#10283f]">Live preview</h2><p className="text-sm text-slate-500">1200 × 630 px · Social media ready</p></div><button type="button" onClick={download} disabled={!form.topic || downloading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#cf6410] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#cf6410]/20 transition hover:-translate-y-0.5 hover:bg-[#b7540d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10283f] disabled:cursor-not-allowed disabled:opacity-50">{downloading ? "Preparing PNG…" : <><Download size={17} /> Download PNG</>}</button></div>
            {!form.topic && <p className="mb-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">Choose a learning topic to enable your banner download.</p>}
            {downloadError && <p role="alert" className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{downloadError}</p>}
            <div ref={frameRef} className="relative aspect-[1200/630] w-full overflow-hidden rounded-2xl bg-slate-200 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/10">
              <div className="absolute left-0 top-0 origin-top-left" style={{ width: 1200, height: 630, transform: `scale(${scale})` }}>
                <BannerArtwork form={form} photo={photo} bannerRef={bannerRef} />
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-slate-500">Made with care for every new skill, every language and every next step.</p>
          </section>
        </div>
      </div>
      {pendingPhoto && <ImageCropDialog image={pendingPhoto} onCancel={() => setPendingPhoto(null)} onConfirm={(croppedImage) => { setPhoto(croppedImage); setPendingPhoto(null); setPhotoError(""); }} />}
    </main>
  );
}
