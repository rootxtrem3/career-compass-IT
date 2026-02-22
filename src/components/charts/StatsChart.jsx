function formatValue(value, unit) {
  if (unit === '%') return `${value}%`;
  if (unit === 'million') return `${value}M`;
  return `${value} ${unit}`;
}

export function StatsChart({ items }) {
  const maxValue = Math.max(...items.map((item) => Number(item.value) || 0), 1);

  return (
    <div className="stats-chart" role="img" aria-label="World career statistics chart">
      {items.map((item) => {
        const ratio = Math.min(100, Math.round(((Number(item.value) || 0) / maxValue) * 100));
        return (
          <div key={item.key} className="stats-bar-row">
            <div className="stats-bar-head">
              <p>{item.label}</p>
              <strong>{formatValue(item.value, item.unit)}</strong>
            </div>
            <div className="stats-track">
              <span className="stats-fill" style={{ width: `${ratio}%` }} />
            </div>
            <small>
              Source: {item.source} ({new Date(item.snapshot_date).toLocaleDateString()})
            </small>
          </div>
        );
      })}
    </div>
  );
}
