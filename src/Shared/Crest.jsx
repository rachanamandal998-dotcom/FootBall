import { colorFor, initials, esc } from '../../utils/helpers';
import '../../styles/crest.css';

export function Crest({ name, size = 30 }) {
  const c = colorFor(name);
  const styles = {
    background: c,
    width: size + 'px',
    height: size + 'px',
    fontSize: (size * 0.4) + 'px'
  };
  
  return (
    <div className="crest" style={styles}>
      {esc(initials(name))}
    </div>
  );
}