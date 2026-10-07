export function Timeline({ items }) {
  return (
    <ol className="relative space-y-10 border-l border-line pl-6 md:pl-8">
      {items.map((item, index) => (
        <li key={`${item.date}-${index}`} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[1.906rem] top-1.5 size-3 rounded-full border-2 border-accent bg-bg md:-left-[2.406rem]"
          />
          <p className="font-mono text-xs tracking-wider text-accent">
            {item.date}
          </p>
          <h3 className="mt-1.5">{item.title}</h3>
          {item.subtitle && (
            <p className="mt-0.5 text-sm text-muted">{item.subtitle}</p>
          )}
          {item.body && (
            <div className="mt-3 text-[0.95rem] text-muted">{item.body}</div>
          )}
        </li>
      ))}
    </ol>
  );
}
