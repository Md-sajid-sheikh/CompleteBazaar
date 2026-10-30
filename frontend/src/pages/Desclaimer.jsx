import { Link } from 'react-router-dom';
import { tw } from '../tw.js';

function Disclaimer() {
  return (
    <div className={tw('editorial-page')}>
      <header className={tw('editorial-heading')}>
        <p className={tw('eyebrow')}><span className={tw('eyebrow-dot')} /> THE DETAILS</p>
        <h1 className={tw('heading editorial-title')}>A quick <em className="text-bazaar-orange">disclaimer.</em></h1>
        <p className={tw('editorial-lead')}>A few helpful notes about the information on CompleteBazaar.</p>
      </header>
      <section className={tw('editorial-content policy-copy')}>
        <h2 className={tw('heading mb-3 text-[22px]')}>Product information</h2>
        <p className="mb-4 text-[13px] leading-[1.8] text-[#62665c]">We work to keep descriptions, images, prices, and availability accurate. Colours and appearance can vary between screens, and product information may change as listings are updated.</p>
        <h2 className={tw('heading mb-3 mt-[21px] text-[22px]')}>Prices and availability</h2>
        <p className="mb-4 text-[13px] leading-[1.8] text-[#62665c]">Product prices and stock are subject to change. The final order details shown when you place an order are the details we use to process it. If an item becomes unavailable, we will contact you using the details on your account.</p>
        <h2 className={tw('heading mb-3 mt-[21px] text-[22px]')}>External services</h2>
        <p className="mb-4 text-[13px] leading-[1.8] text-[#62665c]">Some parts of the shopping experience may rely on third-party services. Their availability and privacy practices are governed by their own terms.</p>
        <h2 className={tw('heading mb-3 mt-[21px] text-[22px]')}>Questions?</h2>
        <p className="mb-4 text-[13px] leading-[1.8] text-[#62665c]">For questions about an order or listing, please use the support contact provided by the store.</p>
        <Link className={tw('text-button')} to="/shop">Return to the bazaar</Link>
      </section>
    </div>
  );
}

export default Disclaimer;