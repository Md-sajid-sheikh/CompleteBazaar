import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext.jsx';
import { selectCartCount } from '../redux/cartSlice.js';
import { tw } from '../tw.js';

function Navbar() {
  const cartCount = useSelector(selectCartCount);
  const { isAuthenticated, user } = useAuth();
  return (
    <div className={tw('site-chrome')}>
      <div className={tw('announcement')}>A little something for every day <span className="text-xs text-[#e9a47a]" aria-hidden="true">✳</span> Discover something new</div>
      <div className={tw('page-shell')}>
        <header className={tw('site-header')}>
          <Link className={tw('wordmark')} to="/" aria-label="CompleteBazaar home">
            <span className={tw('brand-mark')} aria-hidden="true">C</span>
            <span>complete<span className={tw('wordmark-light')}>bazaar</span></span>
          </Link>
          <nav className={tw('main-nav')} aria-label="Main navigation">
            <Link to="/shop">Explore</Link>
            <Link to="/about">About</Link>
          </nav>
          <Link className={tw('header-account-link')} to={isAuthenticated ? '/profile' : '/login'}>
            {isAuthenticated ? 'Account' : 'Sign in'}
          </Link>
          {user?.role === 'admin' && <Link className={tw('header-account-link')} to="/admin">Admin</Link>}
          <Link className={tw('cart-link')} to="/cart" aria-label={`Shopping bag, ${cartCount} items`}>
            Bag <span className={tw('cart-badge')}>{cartCount}</span>
          </Link>
          <Link className={tw('header-link')} to="/shop">Browse the bazaar <span aria-hidden="true">↗</span></Link>
        </header>
      </div>
    </div>
  );
}

export default Navbar;
