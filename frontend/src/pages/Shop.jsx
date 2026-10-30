import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { tw } from '../tw.js';
import { apiRequest } from '../api.js';

function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
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
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Could not connect to the shop.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchProducts();
    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category?.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [products],
  );

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesSearch = !query
        || [product.name, product.category, product.description]
          .some((value) => String(value || '').toLocaleLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });

    if (sort === 'price-low') filtered.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === 'price-high') filtered.sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === 'name') filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return filtered;
  }, [products, search, category, sort]);

  function resetFilters() {
    setSearch('');
    setCategory('All');
    setSort('featured');
  }

  return (
    <div className={tw('page-shell shop-page')}>
      <section className={tw('shop-heading')} aria-labelledby="shop-title">
        <p className={tw('eyebrow')}><span className={tw('eyebrow-dot')} /> THE COMPLETE COLLECTION</p>
        <h1 className={tw('heading shop-title')} id="shop-title">The bazaar<span className="text-bazaar-orange">.</span></h1>
        <p className={tw('shop-intro')}>Find something useful, lovely, or a little bit of both.</p>
      </section>

      <section className={tw('shop-catalog')} aria-label="Browse products">
        <div className={tw('shop-toolbar')}>
          <label className={tw('shop-search')}>
            <span className={tw('visually-hidden')}>Search products</span>
            <span className="text-2xl leading-none text-bazaar-green" aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search the bazaar"
            />
          </label>
          <label className={tw('shop-select')}>
            <span className={tw('visually-hidden')}>Filter by category</span>
            <select className={tw('shop-select-control')} value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="All">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className={tw('shop-select')}>
            <span className={tw('visually-hidden')}>Sort products</span>
            <select className={tw('shop-select-control')} value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </label>
        </div>

        {!loading && !error && (
          <div className={tw('shop-results')}>
            <p className="m-0">{visibleProducts.length} {visibleProducts.length === 1 ? 'find' : 'finds'} to explore</p>
            {(search || category !== 'All' || sort !== 'featured') && (
              <button type="button" className={tw('text-button')} onClick={resetFilters}>Clear filters</button>
            )}
          </div>
        )}

        {loading ? (
          <p className={tw('products-message')} role="status">Loading products…</p>
        ) : error ? (
          <div className={tw('shop-empty-state')} role="alert">
            <p className="my-[10px] text-sm">{error}</p>
            <p className="my-[10px] text-sm">Please try again in a moment.</p>
          </div>
        ) : visibleProducts.length ? (
          <div className={tw('product-grid')}>
            {visibleProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : products.length ? (
          <div className={tw('shop-empty-state')}>
            <h2 className={tw('heading text-[28px] text-bazaar-ink')}>No finds this time<span className="text-bazaar-orange">.</span></h2>
            <p className="my-[10px] text-sm">Try a different search or category.</p>
            <button type="button" className={tw('text-button')} onClick={resetFilters}>Clear filters</button>
          </div>
        ) : (
          <div className={tw('shop-empty-state')}>
            <h2 className={tw('heading text-[28px] text-bazaar-ink')}>The shelves are waiting<span className="text-bazaar-orange">.</span></h2>
            <p className="my-[10px] text-sm">There are no products here just yet. Check back soon.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Shop;