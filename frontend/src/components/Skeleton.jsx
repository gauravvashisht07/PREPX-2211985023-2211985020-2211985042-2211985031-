export function Skeleton({ width = '100%', height = 20, radius = 8, style = {} }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)',
      backgroundSize: '400% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style,
    }} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card">
      <Skeleton width={44} height={44} radius={12} />
      <div style={{ flex: 1 }}>
        <Skeleton height={28} width="60%" style={{ marginBottom: 6 }} />
        <Skeleton height={14} width="80%" />
      </div>
    </div>
  );
}

export function QuestionSkeleton() {
  return (
    <div className="question-card" style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton width={20} height={20} radius={10} />
        <Skeleton height={18} style={{ flex: 1 }} />
        <Skeleton width={60} height={22} radius={99} />
      </div>
    </div>
  );
}

export function PageSkeleton({ rows = 5 }) {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <Skeleton height={32} width="40%" style={{ marginBottom: 8 }} />
      <Skeleton height={16} width="25%" style={{ marginBottom: 28 }} />
      {Array.from({ length: rows }).map((_, i) => <QuestionSkeleton key={i} />)}
    </div>
  );
}
