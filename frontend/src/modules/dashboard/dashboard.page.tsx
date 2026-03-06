import { useState } from 'react'
import { Users, Calendar, TrendingUp, Euro } from 'lucide-react'
import { useDashboard } from './useDashboard'

const PERIODS = [
    { label: '7 jours', value: 7 },
    { label: '30 jours', value: 30 },
    { label: '90 jours', value: 90 },
    { label: '1 an', value: 365 },
]

const STATUS_LABELS: Record<string, string> = {
    pending: 'En attente',
    accepted: 'Acceptée',
    refused: 'Refusée',
    cancelled: 'Annulée',
    completed: 'Terminée',
    paid: 'Payée',
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-400',
    accepted: 'bg-green-500',
    refused: 'bg-red-500',
    cancelled: 'bg-gray-400',
    completed: 'bg-blue-500',
    paid: 'bg-purple-500',
}

const MEAL_LABELS: Record<string, string> = {
    breakfast: 'Petit-déjeuner',
    lunch: 'Déjeuner',
    dinner: 'Dîner',
}

const SPECIALITY_LABELS: Record<string, string> = {
    french_cooking: 'Française',
    italian_cooking: 'Italienne',
    asian_cooking: 'Asiatique',
    mexican_cooking: 'Mexicaine',
    vegetarian_cooking: 'Végétarienne',
    pastry_cooking: 'Pâtisserie',
    japanese_cooking: 'Japonaise',
    indian_cooking: 'Indienne',
    autre: 'Autre',
}

const VALIDATION_LABELS: Record<string, string> = {
    pending: 'En attente',
    validated: 'Validés',
    refused: 'Refusés',
}

const VALIDATION_COLORS: Record<string, string> = {
    pending: 'bg-yellow-400',
    validated: 'bg-green-500',
    refused: 'bg-red-500',
}

// ─── Sparkline SVG ─────────────────────────────────────────────────────────────

function Sparkline({
    data,
    valueKey,
    color = '#E85D04',
}: {
    data: { [key: string]: number | string }[]
    valueKey: string
    color?: string
}) {
    if (!data.length) return null
    const values = data.map((d) => d[valueKey] as number)
    const max = Math.max(...values, 1)
    const W = 400
    const H = 64

    const toPoint = (v: number, i: number) => {
        const x = values.length === 1 ? W / 2 : (i / (values.length - 1)) * W
        const y = H - (v / max) * (H - 8) - 4
        return { x, y }
    }

    const pts = values.map(toPoint)
    const polyline = pts.map((p) => `${p.x},${p.y}`).join(' ')
    const area = [
        `0,${H}`,
        ...pts.map((p) => `${p.x},${p.y}`),
        `${W},${H}`,
    ].join(' ')

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: H }}
        >
            <polygon points={area} fill={color} fillOpacity={0.12} />
            <polyline
                points={polyline}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

// ─── Distribution bar ──────────────────────────────────────────────────────────

function DistributionBar({
    label,
    count,
    total,
    colorClass,
}: {
    label: string
    count: number
    total: number
    colorClass: string
}) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">
                    {count}{' '}
                    <span className="text-muted-foreground">({pct}%)</span>
                </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                    className={`h-full rounded-full transition-all ${colorClass}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    )
}

// ─── KPI card ──────────────────────────────────────────────────────────────────

function KpiCard({
    title,
    value,
    subtitle,
    trend,
    icon: Icon,
}: {
    title: string
    value: string | number
    subtitle?: string
    trend?: string
    icon: React.ElementType
}) {
    return (
        <div className="rounded-lg border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{title}</p>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
                <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && <p className="mt-1 text-xs text-primary">{trend}</p>}
        </div>
    )
}

// ─── Chart card ───────────────────────────────────────────────────────────────

function ChartCard({
    title,
    subtitle,
    children,
    className = '',
}: {
    title: string
    subtitle: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={`rounded-lg border bg-card p-5 ${className}`}>
            <h2 className="mb-0.5 text-sm font-semibold">{title}</h2>
            <p className="mb-4 text-xs text-muted-foreground">{subtitle}</p>
            {children}
        </div>
    )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export const DashboardPage = () => {
    const [period, setPeriod] = useState(30)
    const { data, isLoading, isError } = useDashboard(period)

    const formatCurrency = (n: number) =>
        new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
        }).format(n)

    const totalCooks = Object.values(data?.cooks.byValidationStatus ?? {}).reduce(
        (a, b) => a + b,
        0
    )

    return (
        <main className="min-h-screen bg-[#FDF6E7] p-6 text-foreground md:p-10">
            <section className="mx-auto w-full max-w-7xl space-y-6">
                {/* Header */}
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Indicateurs clés de la plateforme
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {PERIODS.map((p) => (
                            <button
                                key={p.value}
                                onClick={() => setPeriod(p.value)}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                    period === p.value
                                        ? 'bg-primary text-primary-foreground'
                                        : 'border bg-card hover:bg-primary/10'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </header>

                {isError && (
                    <div className="rounded-lg border bg-card p-8 text-center text-sm text-destructive">
                        Impossible de charger les données.
                    </div>
                )}

                {isLoading && (
                    <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
                        Chargement…
                    </div>
                )}

                {data && (
                    <>
                        {/* ── KPI cards ─────────────────────────────────── */}
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <KpiCard
                                title="Utilisateurs"
                                value={data.users.total}
                                subtitle={`${data.users.byRole.clients} clients · ${data.users.byRole.cooks} cuisiniers`}
                                trend={`+${data.users.newInPeriod} sur la période`}
                                icon={Users}
                            />
                            <KpiCard
                                title="Réservations"
                                value={data.bookings.total}
                                subtitle={`${data.bookings.byStatus.completed ?? 0} terminées · ${data.bookings.byStatus.pending ?? 0} en attente`}
                                trend={`+${data.bookings.inPeriod} sur la période`}
                                icon={Calendar}
                            />
                            <KpiCard
                                title="CA estimé (commissions)"
                                value={formatCurrency(data.revenue.totalEstimated)}
                                subtitle={`Commission ${(data.revenue.commissionRate * 100).toFixed(0)}% · données simulées`}
                                trend={`+${formatCurrency(data.revenue.inPeriodEstimated)} sur la période`}
                                icon={Euro}
                            />
                            <KpiCard
                                title="Cuisiniers validés"
                                value={data.cooks.byValidationStatus.validated ?? 0}
                                subtitle={`${data.cooks.byValidationStatus.pending ?? 0} en attente de validation`}
                                icon={TrendingUp}
                            />
                        </div>

                        {/* ── Courbes d'évolution ────────────────────────── */}
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <ChartCard
                                title="Inscriptions"
                                subtitle="Nouveaux utilisateurs sur la période"
                            >
                                <Sparkline
                                    data={data.users.evolution}
                                    valueKey="count"
                                    color="#E85D04"
                                />
                            </ChartCard>
                            <ChartCard
                                title="Réservations"
                                subtitle="Réservations par date de prestation sur la période"
                            >
                                <Sparkline
                                    data={data.bookings.evolution}
                                    valueKey="count"
                                    color="#2563EB"
                                />
                            </ChartCard>
                            <ChartCard
                                title="Chiffre d'affaires estimé"
                                subtitle="Commissions sur prestations terminées · données simulées"
                                className="lg:col-span-2"
                            >
                                <Sparkline
                                    data={data.revenue.evolution}
                                    valueKey="amount"
                                    color="#16A34A"
                                />
                            </ChartCard>
                        </div>

                        {/* ── Répartitions ──────────────────────────────── */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {/* Statut réservations */}
                            <div className="rounded-lg border bg-card p-5 space-y-3">
                                <h2 className="text-sm font-semibold">
                                    Statut des réservations
                                </h2>
                                {Object.entries(data.bookings.byStatus)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([status, count]) => (
                                        <DistributionBar
                                            key={status}
                                            label={STATUS_LABELS[status] ?? status}
                                            count={count}
                                            total={data.bookings.total}
                                            colorClass={
                                                STATUS_COLORS[status] ?? 'bg-primary'
                                            }
                                        />
                                    ))}
                            </div>

                            {/* Type de repas */}
                            <div className="rounded-lg border bg-card p-5 space-y-3">
                                <h2 className="text-sm font-semibold">Type de repas</h2>
                                {Object.entries(data.bookings.byMealType)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([type, count]) => (
                                        <DistributionBar
                                            key={type}
                                            label={MEAL_LABELS[type] ?? type}
                                            count={count}
                                            total={data.bookings.total}
                                            colorClass="bg-primary"
                                        />
                                    ))}
                            </div>

                            {/* Rôles + validation cuisiniers */}
                            <div className="rounded-lg border bg-card p-5 space-y-5">
                                <div className="space-y-3">
                                    <h2 className="text-sm font-semibold">
                                        Rôles utilisateurs
                                    </h2>
                                    <DistributionBar
                                        label="Clients"
                                        count={data.users.byRole.clients}
                                        total={data.users.total}
                                        colorClass="bg-blue-500"
                                    />
                                    <DistributionBar
                                        label="Cuisiniers"
                                        count={data.users.byRole.cooks}
                                        total={data.users.total}
                                        colorClass="bg-orange-500"
                                    />
                                    <DistributionBar
                                        label="Admins"
                                        count={data.users.byRole.admins}
                                        total={data.users.total}
                                        colorClass="bg-gray-500"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-sm font-semibold">
                                        Validation cuisiniers
                                    </h2>
                                    {Object.entries(data.cooks.byValidationStatus).map(
                                        ([status, count]) => (
                                            <DistributionBar
                                                key={status}
                                                label={
                                                    VALIDATION_LABELS[status] ?? status
                                                }
                                                count={count}
                                                total={totalCooks}
                                                colorClass={
                                                    VALIDATION_COLORS[status] ??
                                                    'bg-primary'
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Spécialités */}
                            <div className="rounded-lg border bg-card p-5 space-y-3">
                                <h2 className="text-sm font-semibold">
                                    Spécialités cuisiniers
                                </h2>
                                {Object.entries(data.cooks.bySpeciality)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([spec, count]) => (
                                        <DistributionBar
                                            key={spec}
                                            label={SPECIALITY_LABELS[spec] ?? spec}
                                            count={count}
                                            total={totalCooks}
                                            colorClass="bg-orange-400"
                                        />
                                    ))}
                            </div>
                        </div>
                    </>
                )}
            </section>
        </main>
    )
}
