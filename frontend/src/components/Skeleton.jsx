export function Skeleton({ width = '100%', height = 20, radius = 8, style = {} }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)',
      backgroundSize: '400% 100%',
      animation: 'shimmer 2s infinite linear',
      ...style,
    }} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
      <Skeleton width={52} height={52} radius={14} />
      <div style={{ flex: 1 }}>
        <Skeleton height={28} width="50%" style={{ marginBottom: 8 }} />
        <Skeleton height={14} width="70%" />
      </div>
    </div>
  );
}

export function QuestionSkeleton() {
  return (
    <div className="glass" style={{ padding: '24px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Skeleton width={22} height={22} radius={11} />
        <div style={{ flex: 1 }}>
            <Skeleton height={18} width="80%" style={{ marginBottom: '8px' }} />
            <Skeleton height={12} width="30%" />
        </div>
        <Skeleton width={70} height={24} radius={8} />
      </div>
    </div>
  );
}

export function PageSkeleton({ rows = 5 }) {
  return (
    <div className="animate-fade-up">
      <div className="section-header" style={{ marginBottom: '40px' }}>
        <Skeleton height={36} width="35%" style={{ marginBottom: '12px' }} />
        <Skeleton height={18} width="20%" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {Array.from({ length: rows }).map((_, i) => <QuestionSkeleton key={i} />)}
      </div>
    </div>
  );
}
