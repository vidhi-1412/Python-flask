export default function LoadingText({ text = "Loading..." }) {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
      <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse [animation-delay:120ms]" />
      <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse [animation-delay:240ms]" />
      <span className="ml-2 text-sm">{text}</span>
    </div>
  );
}
