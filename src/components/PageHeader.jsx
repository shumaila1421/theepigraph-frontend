export default function PageHeader({ title, description, action }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-8">
      <div>
        <h1 className="text-4xl tracking-tight sm:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-md text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
