import { Link } from 'react-router-dom';
import { tw } from '../tw.js';

function ReturnPolicy() {
  return (
    <div className={tw('editorial-page')}>
      <header className={tw('editorial-heading')}>
        <p className={tw('eyebrow')}><span className={tw('eyebrow-dot')} /> SHOP WITH CONFIDENCE</p>
        <h1 className={tw('heading editorial-title')}>Returns &amp; <em className="text-bazaar-orange">help.</em></h1>
        <p className={tw('editorial-lead')}>If something isn’t right with your order, here are the next steps.</p>
      </header>
      <section className={tw('editorial-content policy-copy')}>
        <h2 className={tw('heading mb-3 text-[22px]')}>Check eligibility</h2>
        <p className="mb-4 text-[13px] leading-[1.8] text-[#62665c]">Return eligibility and any applicable return window may vary by product. Please review the product listing and order information before requesting a return.</p>
        <h2 className={tw('heading mb-3 mt-[21px] text-[22px]')}>Report an issue</h2>
        <p className="mb-4 text-[13px] leading-[1.8] text-[#62665c]">If an item arrives damaged, incorrect, or incomplete, keep the item and its packaging and contact the store using the support details provided with your order. Include your order number and a clear description of the issue.</p>
        <h2 className={tw('heading mb-3 mt-[21px] text-[22px]')}>Condition and refunds</h2>
        <p className="mb-4 text-[13px] leading-[1.8] text-[#62665c]">Unless the item is damaged or incorrect, eligible returns should be unused and include original packaging and accessories. Refunds or replacements are handled after the returned item is reviewed and may depend on the original payment method.</p>
        <h2 className={tw('heading mb-3 mt-[21px] text-[22px]')}>Need more help?</h2>
        <p className="mb-4 text-[13px] leading-[1.8] text-[#62665c]">For a return request, please use the support contact provided by the store. This page should be updated with your final return window and contact details before launch.</p>
        <Link className={tw('primary-button')} to="/shop">Continue shopping <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  );
}

export default ReturnPolicy;