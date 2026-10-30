import { Link } from 'react-router-dom';
import { tw } from '../tw.js';

function Footer() {
  return (
    <footer className={tw('footer-shell-new')} id="about">
      <Link className={tw('footer-brand-new')} to="/">CompleteBazaar</Link>
      <span className={tw('footer-tagline-new')}>Thoughtful finds for everyday life.</span>
      <nav className={tw('footer-links-new')} aria-label="Footer navigation">
        <Link to="/about">About</Link>
        <Link to="/return-policy">Returns</Link>
        <Link to="/disclaimer">Disclaimer</Link>
      </nav>
      <button className={tw('back-to-top-new')} type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Back to top ↑
      </button>
    </footer>
  );
}

export default Footer;
