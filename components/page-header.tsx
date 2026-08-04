export function PageHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-balance text-foreground md:text-3xl">
        {title}
      </h1>
      <p className="mt-1 text-muted-foreground text-pretty">{description}</p>
    </div>
  )
}
