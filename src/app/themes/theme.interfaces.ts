export interface ThemeAssetConfig {
  logoUrl: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  jumboBgUrl?: string;
  cardDefaultBgUrl?: string;
  // other specific theme assets
}

export interface ThemeLinkConfig {
  linkedin?: string;
  youtube?: string;
  twitter?: string;
  // Add more theme specific links
  privacyPolicy?: string;
  termsOfService?: string;
  contactUs?: string;

}

export interface ThemeColorsConfig {
  // Optional: to manage base colors from JS moreover from CSS vars
  primary?: string;
  secondary?: string;
}

export interface ThemeAuthUrlsConfig {
  loginUrl?: string; // loginURL
  registerUrl?: string; // registerURL
  // Other possible URLs..
}

export interface DashboardConfig {
  showFeaturedOfferings?: boolean;
  showPlatformBenefits?: boolean;
  // Add more sections
}


export interface ThemeConfig {
  name: string; // Theme Id, ej: 'DOME', 'OCEAN'
  displayName?: string; // Name to be displayed, ej: 'Dome Marketplace', 'Ocean Breeze'
  isDefault?: boolean; // Optional: sets default theme
  assets: ThemeAssetConfig;
  links?: ThemeLinkConfig;
  authUrls?: ThemeAuthUrlsConfig;
  colors?: ThemeColorsConfig;
  dashboard?: DashboardConfig;
  // More theme specific propierties
}
