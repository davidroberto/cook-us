export const formatDate = (value: string | null): string => {
    if (!value) return '-'
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value))
}
