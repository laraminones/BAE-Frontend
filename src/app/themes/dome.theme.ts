import { ThemeConfig } from './theme.interfaces';
import { environment } from '../../environments/environment';

export const DOME_THEME_CONFIG: ThemeConfig = {
  name: 'DOME',
  displayName: 'Dome Marketplace',
  assets: {
    logoUrl: 'assets/themes/dome/dome-logo.svg',
    jumboBgUrl: 'assets/themes/dome/jumboBackground.png',
    cardDefaultBgUrl: 'assets/logos/dome-logo-element-colour.png'
  },
  links: {
    linkedin: environment.DOME_LINKEDIN,
    youtube: environment.DOME_YOUTUBE,
    twitter: environment.DOME_X,
  },
  dashboard: {
    title: 'Digital Trust to move forward',
    subtitle: 'Join the first open distributed marketplace ecosystem for cloud, edge & AI services in Europe.',
    showFeaturedOfferings: true,
    showPlatformBenefits: true,
  }
};
