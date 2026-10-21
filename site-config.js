/* =========================================================
   LOCAL EDGE - site-config.js
   THE ONE FILE TO EDIT for prices, contact details, forms and reviews.
   (Pages also contain the same prices as plain text, so the site still reads
    correctly if JavaScript is off. See README.md "Changing a price".)
   ========================================================= */
window.LE_CONFIG = {

  /* ---- Contact (used for WhatsApp links, form fallbacks and email links) ---- */
  contact: {
    whatsapp: '263784871124',            // digits only, with country code, no + or spaces
    phoneDisplay: '+263 78 487 1124',
    email: 'atlocaledge@gmail.com'
  },

  /* ---- Forms ----
     Paste a Formspree endpoint (https://formspree.io/f/xxxxxxxx) for each form, or leave '' for the
     WhatsApp/email fallback. While a value is '', NOTHING is stored or emailed automatically:
     the visitor is given a pre-filled WhatsApp message and an email link instead.
     You can use one endpoint for all three forms or three separate forms. */
  forms: {
    demo: '',
    enquiry: '',
    feedback: ''
  },

  /* ---- Base prices in USD (starting prices) ---- */
  prices: {
    starter: 125,
    business: 250,
    hospitality: 350,
    advanced: 600
  },
  packageNames: {
    starter: 'Starter Website',
    business: 'Business Website',
    hospitality: 'Hospitality Website',
    advanced: 'Advanced Website'
  },

  /* ---- Monthly care plans in USD ---- */
  retainers: {
    care: 35,
    growth: 75,
    partner: 150
  },

  /* ---- Payment structure (percent) ---- */
  payment: { deposit: 60, final: 40 },

  /* ---- Introductory offer (OFF by default) ----
     Set active:true only for a real, agreed offer. It shows the standard price, the discount and
     the resulting price on the Services page. It never shows a countdown or a deadline.
     'package' must be one of: starter, business, hospitality, advanced. */
  introOffer: {
    active: false,
    package: 'hospitality',
    discount: 100,
    label: 'Introductory offer',
    note: 'Individually quoted for one agreed scope. Not available to every project.'
  },

  /* ---- Approved reviews (EMPTY until real clients approve publication) ----
     Add one object per review. Only entries with permission:'approved' are shown.
     {
       quote: 'Exact words the client approved.',
       attribution: 'Name and business exactly as approved for publication',
       service: 'Business Website',
       date: 'Month Year',
       permission: 'approved'      // anything else keeps it hidden
     }                                                                        */
  reviews: []
};
