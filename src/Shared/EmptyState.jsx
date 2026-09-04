import { esc } from '../../utils/helpers';
import '../../styles/emptyState.css';

export function EmptyState({ big, small = '', action = null }) {
  return (
    <div className="empty-state">
      <div className="big">{esc(big)}</div>
      {small && <div>{esc(small)}</div>}
      {action && action}
    </div>
  );
}