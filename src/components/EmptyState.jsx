export default function EmptyState({ title, message, action }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-white/50 px-6 py-16 text-center">
      <h3 className="text-2xl">{title}</h3>
      <p className="mx-auto mb-6 mt-2 max-w-sm text-muted">{message}</p>
      {action}
    </div>
  );
}
