export default function Spinner({ small = false, label = 'Loading...' }) {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2 py-3">
      <div className={`spinner-border ${small ? 'spinner-border-sm' : ''} text-primary`} role="status" />
      <span className="text-secondary">{label}</span>
    </div>
  );
}
