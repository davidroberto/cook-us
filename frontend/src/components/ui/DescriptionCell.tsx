export const DescriptionCell = ({ text }: { text: string | null }) => {
    if (!text) return <span className="text-muted-foreground">-</span>
    return (
        <div className="group relative">
            <span className="block max-w-[180px] cursor-default truncate">{text}</span>
            <div className="pointer-events-none absolute left-0 top-full z-50 mt-1 hidden w-72 rounded-md border border-border bg-card px-3 py-2 text-xs shadow-lg group-hover:block">
                {text}
            </div>
        </div>
    )
}
