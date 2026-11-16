import { html, json } from '../lib/html.js';
import { createT } from '../lib/i18n.js';
import { assetUrl, pageUrl } from '../lib/paths.js';
import { section } from '../components/section.js';
import { pageHead } from '../components/page-head.js';
import { header } from '../sections/header.js';
import { hero } from '../sections/hero.js';
import { about } from '../sections/about.js';
import { skills } from '../sections/skills.js';
import { experience } from '../sections/experience.js';
import { projects } from '../sections/projects.js';
import { education } from '../sections/education.js';
import { timeline } from '../sections/timeline.js';
import { contact } from '../sections/contact.js';
import { footer } from '../sections/footer.js';

const SECTIONS = Object.entries({ about, skills, experience, projects, education, timeline, contact });

const NUMBERS = Object.fromEntries(SECTIONS.map(([id], i) => [id, String(i + 1).padStart(2, '0')]));

const OG_IMAGE = { file: 'og.png', width: 1200, height: 630 };

const person = ({ meta, basics }, lang, t) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: t(basics.name),
  jobTitle: basics.label,
  url: pageUrl(meta, lang),
  sameAs: basics.profiles.map(({ url }) => url),
  address: {
    '@type': 'PostalAddress',
    addressLocality: t(basics.location.city),
    addressCountry: basics.location.countryCode,
  },
});

const seoTags = (data, lang, t) => {
  const { meta, seo } = data;
  const url = pageUrl(meta, lang);

  return html`<link rel="canonical" href="${url}">
    ${meta.langs.map((code) => html`<link rel="alternate" hreflang="${code}" href="${pageUrl(meta, code)}">`)}
    <link rel="alternate" hreflang="x-default" href="${pageUrl(meta, meta.defaultLang)}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${t(seo.title)}">
    <meta property="og:description" content="${t(seo.description)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${assetUrl(meta, OG_IMAGE.file)}">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="${OG_IMAGE.width}">
    <meta property="og:image:height" content="${OG_IMAGE.height}">
    <meta property="og:image:alt" content="${t(seo.title)}">
    <meta property="og:locale" content="${meta.locales[lang]}">
    ${meta.langs.filter((code) => code !== lang).map((code) => html`<meta property="og:locale:alternate" content="${meta.locales[code]}">`)}
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json">${json(person(data, lang, t))}</script>`;
};

export const page = (data, lang, { headScript, analytics }) => {
  const { seo, ui } = data;
  const i18n = createT(lang);
  const { t } = i18n;
  const [defaultPalette] = Object.keys(ui.palette.names);

  return html`<!doctype html>
<html lang="${lang}" data-theme="dark" data-palette="${defaultPalette}">
  ${pageHead(data, {
    title: t(seo.title),
    description: t(seo.description),
    headScript,
    extra: seoTags(data, lang, t),
    analytics,
  })}
  <body>
    ${header(data, { ...i18n, defaultPalette, numbers: NUMBERS })}
    <main id="main">
      ${hero(data, i18n)}
      ${SECTIONS.map(([id, content], i) =>
        section({
          id,
          number: NUMBERS[id],
          title: t(ui.sections[id].title),
          alt: i % 2 === 0,
          content: content(data, i18n),
        }),
      )}
    </main>
    ${footer(data, i18n)}
  </body>
</html>
`;
};
