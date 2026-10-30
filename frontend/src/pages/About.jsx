import { Link } from 'react-router-dom';
import { tw } from '../tw.js';

function About() {
  return (
    <div className={tw('editorial-page')}>
      <header className={tw('about-header')}>
        <p className={tw('eyebrow')}><span className={tw('eyebrow-dot')} /> A LITTLE ABOUT US</p>
        <h1 className={tw('heading editorial-title')}>Everyday things,<br /><em className="text-bazaar-orange">thoughtfully found.</em></h1>
        <p className={tw('about-lead')}>CompleteBazaar brings useful, lovely finds together in one easy place.</p>
      </header>
      <section className={tw('about-content')}>
        <h2 className={tw('heading mb-3 text-[22px]')}>Our idea<span className="text-bazaar-orange">.</span></h2>
        <p className="mb-4 text-[13px] leading-[1.8] text-[#354d3d]">Good shopping should feel simple. We curate a changing collection across categories, so you can discover something practical, something special, or a bit of both.</p>
        <p className="mb-4 text-[13px] leading-[1.8] text-[#354d3d]">Browse the collection, explore the details, and choose what works for your everyday. We are building CompleteBazaar to make those small discoveries feel a little more considered.</p>
        <Link className={tw('primary-button')} to="/shop">Explore the bazaar <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  );
}

export default About;
