export default function FormSectionWrapper({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {title && <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>}
      <div className="border-solid border-l border-neutral-400 py-2 pl-4">{children}</div>
    </div>
  );
}
