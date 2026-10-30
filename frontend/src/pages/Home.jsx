import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { Link } from 'react-router-dom';
import { tw } from '../tw.js';
import { apiRequest } from '../api.js';

const categories = [
  { number: '01', name: 'Tech & gadgets', note: 'Tools for your everyday', icon: '◉' },
  { number: '02', name: 'Home & living', note: 'Make room for comfort', icon: '⌂' },
  { number: '03', name: 'Style & apparel', note: 'Find your own rhythm', icon: '✳' },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setError('');
        const data = await apiRequest('/api/products', { signal: controller.signal });
        if (!Array.isArray(data)) throw new Error('The product list could not be loaded.');
        setProducts(data);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Could not connect to the shop.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchProducts();
    return () => controller.abort();
  }, []);

  return (
    <div className={tw('page-shell home-page')}>
      <section className={tw('hero')} id="home">
        <div className={tw('hero-copy')}>
          <p className={tw('eyebrow')}><span className={tw('eyebrow-dot')} /> THE EVERYDAY, WELL FOUND</p>
          <h1 className={tw('heading hero-title')}>Good things<br />live <em className="text-bazaar-orange">here.</em></h1>
          <p className={tw('hero-description')}>A considered collection of useful, lovely things for the life you’re living right now.</p>
          <a className={tw('primary-button')} href="#products">Find your next favorite <span aria-hidden="true">↗</span></a>
          <div className={tw('hero-footnote')}><span className={tw('footnote-line')} /> A world of finds, all in one place</div>
        </div>

        <div className={tw('hero-art')} role="img" aria-label="Illustration of a curated collection of everyday finds">
          <div className={tw('art-stamp')}>CURATED<br />WITH CARE</div>
          <div className={tw('art-sun')} />
          <div className={tw('art-orbit orbit-one')} />
          <div className={tw('art-orbit orbit-two')} />
          <div className={tw('art-card card-back')}><span>little<br />details</span><i>✳</i></div>
          <div className={tw('art-card card-front')}><span>everyday<br />favorites</span><i>✦</i></div>
          <div className={tw('art-caption')}>OBJECTS FOR A LIFE WELL LIVED</div>
          <span className={tw('art-spark spark-one')} aria-hidden="true">✳</span>
          <span className={tw('art-spark spark-two')} aria-hidden="true">✦</span>
        </div>
      </section>

      <section className={tw('category-section')} aria-labelledby="categories-title">
        <div className={tw('section-heading')}>
          <div>
            <p className={tw('eyebrow')}>A GOOD PLACE TO START</p>
            <h2 className={tw('heading text-[clamp(29px,3vw,38px)]')} id="categories-title">Take a look around<span className="text-bazaar-orange">.</span></h2>
          </div>
          <p className={tw('section-note')}>A few corners of our little world</p>
        </div>
        <div className={tw('category-grid')}>
          {categories.map((category) => (
            <a className={tw('category-card')} href="#products" key={category.number}>
              <span className={tw('category-number')}>{category.number}</span>
              <span className={tw('category-icon')} aria-hidden="true">{category.icon}</span>
              <span className={tw('category-title')}>{category.name}</span>
              <span className={tw('category-note')}>{category.note}</span>
              <span className={tw('category-arrow')} aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className={tw('featured-section')} id="products" aria-labelledby="featured-title">
        <div className={tw('section-heading')}>
          <div>
            <p className={tw('eyebrow')}>PICKED FOR YOU</p>
            <h2 className={tw('heading text-[clamp(29px,3vw,38px)]')} id="featured-title">Featured finds<span className="text-bazaar-orange">.</span></h2>
          </div>
          <p className={tw('section-note')}>A few good things to get you started</p>
        </div>

        {loading ? (
          <p className={tw('products-message')} role="status">Loading products…</p>
        ) : error ? (
          <p className={tw('products-message')} role="status">{error} Start the backend to see products here.</p>
        ) : products.length ? (
          <>
            <div className={tw('product-grid')}>
              {products.map((product) => <ProductCard key={product._id || product.id} product={product} />)}
            </div>
            <div className="mt-7 flex justify-center">
              <Link className={tw('primary-button')} to="/shop">
                Explore all products <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </>
        ) : (
          <p className={tw('products-message')}>No products yet. Check back soon.</p>
        )}
      </section>
    </div>
  );
}

export default Home;
