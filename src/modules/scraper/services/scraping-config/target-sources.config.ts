/* eslint-disable prettier/prettier */
/**
 * Targeted Sources Configuration
 * This file contains the specific LinkedIn and YouTube sources to scrape
 * Based on the provided PDF list of approved sources
 */

export interface TargetSource {
  name: string;
  type: 'linkedin' | 'youtube' | 'website';
  url: string;
  active: boolean;
}

// LinkedIn Company Pages (from PDF list)
export const LINKEDIN_TARGETS: TargetSource[] = [
  { name: 'Swissrail', type: 'linkedin', url: 'linkedin.com/company/swissrail', active: true },
  { name: 'TR Transrail', type: 'linkedin', url: 'linkedin.com/company/tr-transrail', active: true },
  { name: 'Railcare AG', type: 'linkedin', url: 'linkedin.com/company/railcare-ag', active: true },
  { name: 'Vanomag AG', type: 'linkedin', url: 'linkedin.com/company/vanomag-ag', active: true },
  { name: 'Furrer+Frey AG', type: 'linkedin', url: 'linkedin.com/company/furrer-frey-ag', active: true },
  { name: 'Kummler + Matter AG', type: 'linkedin', url: 'linkedin.com/company/kummler-und-matter-ag', active: true },
  { name: 'RBS', type: 'linkedin', url: 'linkedin.com/company/regionalverkehr-bern-solothurn-rbs', active: true },
  { name: 'Eisenbahn in Ö-D-CH', type: 'linkedin', url: 'linkedin.com/company/eisenbahn-in-ö-d-ch', active: true },
  { name: 'Bahnblogstelle', type: 'linkedin', url: 'linkedin.com/company/bahnblogstelle', active: true },
  { name: 'Eisenbahnblog', type: 'linkedin', url: 'linkedin.com/company/eisenbahnblog', active: true },
  { name: 'BVZ Holding AG', type: 'linkedin', url: 'linkedin.com/company/bvz-holding-ag-bvzn-', active: true },
  { name: 'Matterhorn Gotthard Bahn', type: 'linkedin', url: 'linkedin.com/company/mgbahn', active: true },
  { name: 'Rhätische Bahn AG', type: 'linkedin', url: 'linkedin.com/company/rhätischebahnag', active: true },
  { name: 'BLS AG', type: 'linkedin', url: 'linkedin.com/company/bls-ag', active: true },
  { name: 'SBB CFF FFS', type: 'linkedin', url: 'linkedin.com/company/sbb-cff-ffs', active: true },
  { name: 'Stadler Rail Group', type: 'linkedin', url: 'linkedin.com/company/stadler-rail-group', active: true },
  { name: 'Alstom', type: 'linkedin', url: 'linkedin.com/company/alstom', active: true },
  { name: 'Siemens Mobility', type: 'linkedin', url: 'linkedin.com/company/siemens-mobility', active: true },
  { name: 'ABB', type: 'linkedin', url: 'linkedin.com/company/abb', active: true },
  {
    name: 'Rhomberg Sersa Rail Group',
    type: 'linkedin',
    url: 'linkedin.com/company/rhomberg-sersa-rail-group',
    active: true,
  },
];

// YouTube Channels (from PDF list)
export const YOUTUBE_TARGETS: TargetSource[] = [
  { name: 'MartiGroup', type: 'youtube', url: '@MartiGroup', active: true },
  { name: 'ImpleniaTube', type: 'youtube', url: '@ImpleniaTube', active: true },
  { name: 'Rhomberg Sersa Rail Group', type: 'youtube', url: '@RhombergSersaRailGroup', active: true },
  { name: 'Müller Frauenfeld AG', type: 'youtube', url: '@mullerfrauenfeldag6277', active: true },
  { name: 'Matterhorn Gotthard Bahn', type: 'youtube', url: '@MatterhornGotthardBahn2003', active: true },
  { name: 'Rhätische Bahn', type: 'youtube', url: '@rhaetischebahn', active: true },
  { name: 'Stadler Rail Group', type: 'youtube', url: '@stadlerrailgroup', active: true },
  { name: 'BLS', type: 'youtube', url: '@BLSBahn', active: true },
  { name: 'SBB CFF FFS', type: 'youtube', url: '@sbbcffffs', active: true },
  { name: 'Alstom', type: 'youtube', url: 'user/Alstom', active: true },
  { name: 'Bahnblogstelle', type: 'youtube', url: '@Bahnblogstelle', active: true },
  { name: 'Regionalverkehr Bern-Solothurn', type: 'youtube', url: '@RegionalverkehrBeSo', active: true },
  { name: 'ZVV', type: 'youtube', url: '@zvv_ch', active: true },
  { name: 'SOB', type: 'youtube', url: '@SOBahn', active: true },
];

// Website Sources - ALL 35+ websites
export const WEBSITE_TARGETS: TargetSource[] = [
  // News & Media
  { name: 'Lok Report', type: 'website', url: 'lok-report.de', active: true },
  { name: 'Rail Market', type: 'website', url: 'railmarket.com', active: true },
  { name: 'Baublatt', type: 'website', url: 'baublatt.ch', active: true },
  { name: 'Pro Bahn', type: 'website', url: 'pro-bahn.ch', active: true },
  { name: 'Presseportal', type: 'website', url: 'presseportal.ch', active: true },
  { name: 'Bahnblogstelle', type: 'website', url: 'bahnblogstelle.com', active: true },
  { name: 'SEV Online', type: 'website', url: 'sev-online.ch', active: true },
  { name: 'Bahnberufe', type: 'website', url: 'bahnberufe.ch', active: true },
  { name: 'Roalps', type: 'website', url: 'roalps.ch', active: true },
  { name: 'Eurailpress', type: 'website', url: 'eurailpress.de', active: true },
  { name: 'ProAlps', type: 'website', url: 'proalps.ch', active: true },
  { name: 'Bahn Online', type: 'website', url: 'bahnonline.ch', active: true },
  
  // Railway Companies
  { name: 'SBB Cargo', type: 'website', url: 'sbbcargo.com', active: true },
  { name: 'BLS', type: 'website', url: 'bls.ch', active: true },
  { name: 'RhB News', type: 'website', url: 'rhb.ch', active: true },
  { name: 'SOB', type: 'website', url: 'sob.ch', active: true },
  { name: 'Zentralbahn', type: 'website', url: 'zentralbahn.ch', active: true },
  
  // Public Transport
  { name: 'Bernmobil', type: 'website', url: 'bernmobil.ch', active: true },
  { name: 'ZVV', type: 'website', url: 'zvv.ch', active: true },
  { name: 'VVL', type: 'website', url: 'vvl.ch', active: true },
  { name: 'RBS', type: 'website', url: 'rbs.ch', active: true },
  { name: 'Aargau Verkehr', type: 'website', url: 'aargauverkehr.ch', active: true },
  
  // Technology & Industry
  { name: 'Alstom', type: 'website', url: 'alstom.com', active: true },
  { name: 'ABB', type: 'website', url: 'abb.com', active: true },
  { name: 'Doppelmayr', type: 'website', url: 'doppelmayr.com', active: true },
  { name: 'Hupac', type: 'website', url: 'hupac.com', active: true },
  { name: 'Rhomberg Sersa', type: 'website', url: 'rhomberg-sersa.com', active: true },
  { name: 'Cargorail', type: 'website', url: 'cargorail.ch', active: true },
  { name: 'C. Vanoli', type: 'website', url: 'c-vanoli.ch', active: true },
  { name: 'Müller Frauenfeld', type: 'website', url: 'mueller-frauenfeld.ch', active: true },
  
  // Government & Organizations
  { name: 'OTIF', type: 'website', url: 'otif.org', active: true },
  { name: 'VOEV', type: 'website', url: 'voev.ch', active: true },
  { name: 'CST', type: 'website', url: 'cst.ch', active: true },
  { name: 'Stadt Zürich', type: 'website', url: 'stadt-zuerich.ch', active: true },
  { name: 'Citrap Vaud', type: 'website', url: 'citrap-vaud.ch', active: true },
];

// Combined configuration
export const ALL_TARGET_SOURCES = [...LINKEDIN_TARGETS, ...YOUTUBE_TARGETS, ...WEBSITE_TARGETS];

// Helper functions
export const getActiveLinkedInSources = () => LINKEDIN_TARGETS.filter((source) => source.active);
export const getActiveYouTubeSources = () => YOUTUBE_TARGETS.filter((source) => source.active);
export const getActiveWebsiteSources = () => WEBSITE_TARGETS.filter((source) => source.active);

export const isAllowedLinkedInCompany = (companyName: string): boolean => {
  return LINKEDIN_TARGETS.some(
    (source) =>
      source.active &&
      (source.url.includes(companyName) || source.name.toLowerCase().includes(companyName.toLowerCase())),
  );
};

export const isAllowedYouTubeChannel = (channelName: string): boolean => {
  return YOUTUBE_TARGETS.some(
    (source) =>
      source.active &&
      (source.url.includes(channelName) || source.name.toLowerCase().includes(channelName.toLowerCase())),
  );
};

export const isAllowedWebsite = (url: string): boolean => {
  return WEBSITE_TARGETS.some((source) => source.active && url.includes(source.url.split('/')[0]));
};
