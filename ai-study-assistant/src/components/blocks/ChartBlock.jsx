const SLOT_WIDTH = 82;
const BAR_WIDTH = 46;
const CHART_HEIGHT = 260;
const BASELINE = 206;
const TOP = 30;
const SIDE_PADDING = 10;
const MAX_LABEL_LENGTH = 14;

function truncateLabel(label) {
  return label.length > MAX_LABEL_LENGTH
    ? `${label.slice(0, MAX_LABEL_LENGTH - 1)}…`
    : label;
}

function formatValue(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function ChartBlock({ data }) {
  const labels = Array.isArray(data?.labels) ? data.labels : [];
  const values = Array.isArray(data?.values) ? data.values : [];

  const title = typeof data?.title === "string" ? data.title : "Chart";
  const description =
    typeof data?.description === "string" ? data.description : "";

  const points = values
    .map((value, index) => ({ label: labels[index], value }))
    .filter(
      (point) =>
        Number.isFinite(point.value) &&
        typeof point.label === "string" &&
        point.label.length > 0
    );

  if (points.length === 0) {
    return (
      <section className="study-block chart-block">
        <header className="study-block-header">
          <p className="eyebrow">CHART</p>

          <h2>{title}</h2>
        </header>

        <p className="chart-empty">This chart does not contain usable data.</p>
      </section>
    );
  }

  const width = points.length * SLOT_WIDTH + SIDE_PADDING * 2;
  const maxValue = Math.max(...points.map((point) => point.value), 0);
  const scale = maxValue > 0 ? (BASELINE - TOP) / maxValue : 0;
  const gridRatios = [0, 0.25, 0.5, 0.75, 1];

  return (
    <section className="study-block chart-block">
      <header className="study-block-header">
        <p className="eyebrow">CHART</p>

        <h2>{title}</h2>

        {description && <p className="chart-description">{description}</p>}
      </header>

      <div className="chart-figure">
        <svg
          viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`${title}. ${points
            .map((point) => `${point.label}: ${formatValue(point.value)}`)
            .join(", ")}`}
        >
          {gridRatios.map((ratio) => {
            const y = BASELINE - (BASELINE - TOP) * ratio;

            return (
              <line
                key={ratio}
                className="chart-grid-line"
                x1={SIDE_PADDING}
                x2={width - SIDE_PADDING}
                y1={y}
                y2={y}
              />
            );
          })}

          {points.map((point, index) => {
            const value = Math.max(point.value, 0);
            const height = value > 0 ? Math.max(value * scale, 3) : 0;
            const x = index * SLOT_WIDTH + SLOT_WIDTH / 2 - BAR_WIDTH / 2;
            const center = index * SLOT_WIDTH + SLOT_WIDTH / 2;

            return (
              <g key={`${index}-${point.label}`}>
                <rect
                  className="chart-bar"
                  x={x}
                  y={BASELINE - height}
                  width={BAR_WIDTH}
                  height={height}
                  rx={9}
                >
                  <title>{`${point.label}: ${formatValue(point.value)}`}</title>
                </rect>

                <text
                  className="chart-value"
                  x={center}
                  y={BASELINE - height - 10}
                  textAnchor="middle"
                >
                  {formatValue(point.value)}
                </text>

                <text
                  className="chart-label"
                  x={center}
                  y={BASELINE + 28}
                  textAnchor="middle"
                >
                  {truncateLabel(point.label)}
                  <title>{point.label}</title>
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

export default ChartBlock;

