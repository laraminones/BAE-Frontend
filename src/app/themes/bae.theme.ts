import { ThemeConfig } from './theme.interfaces';
// Si este tema no usa 'environment' para los enlaces, no necesitas importarlo aquí.

export const BAE_THEME_CONFIG: ThemeConfig = {
  name: 'BAE',
  displayName: 'BAE Default Theme',
  isDefault: true,
  assets: {
    logoUrl: 'assets/themes/bae/bae-logo.svg',
    jumboBgUrl: 'assets/themes/bae/jumboBackground.png',
    cardDefaultBgUrl: 'assets/logos/dome-logo-element-colour.png'
  },
  links: {
    linkedin: 'https://linkedin.com/company/ocean-theme-example',
    youtube: 'https://youtube.com/c/ocean-theme-example',
    twitter: 'https://twitter.com/ocean-theme-example',
  },
  dashboard: {
    title: 'The Trusted Data Space Marketplace',
    subtitle: 'The FIWARE BAE Marketplace leverages the FIWARE Data Space Connector to share data and services in the cloud, edge and AI.',
    showFeaturedOfferings: true,
    showPlatformBenefits: false,
  }
};
