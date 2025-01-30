export const environment = {
    //BASE_URL: 'https://dome-marketplace.org',
    BASE_URL: 'http://proxy.docker:8004',
    //API_PORT: 8004,
    //API_PORT: 443,
    LEGACY_PREFIX: '',
    PRODUCT_CATALOG: '/catalog',
    SERVICE: '/service',
    RESOURCE: '/resource',
    PRODUCT_SPEC: '/productSpecification',
    SERVICE_SPEC: '/serviceSpecification',
    RESOURCE_SPEC: '/resourceSpecification',
    ACCOUNT: '/account',
    SHOPPING_CART: '/shoppingCart',
    INVENTORY: '/inventory',
    PRODUCT_ORDER: '/ordering',
    CUSTOMER_BILLING:'/appliedCustomerBillingRate',
    CONSUMER_BILLING_URL: 'http://localhost:8640',
    INVOICE_LIMIT: 100,
    //API PAGINATION
    PRODUCT_LIMIT: 6,
    CATALOG_LIMIT: 8,
    INVENTORY_LIMIT: 6,
    INVENTORY_RES_LIMIT: 6,
    INVENTORY_SERV_LIMIT: 6,
    PROD_SPEC_LIMIT: 6,
    SERV_SPEC_LIMIT: 6,
    RES_SPEC_LIMIT: 6,
    ORDER_LIMIT: 6,
    CATEGORY_LIMIT: 100,
    TAX_RATE: 20,
    CHAT_API: 'https://eng-gpt.dome-marketplace-sbx.org/predict',
    SIOP_INFO: {
        enabled: false,
        isRedirection: false,
        pollPath: "",
        pollCertPath: "",
        clientID: "",
        callbackURL: "",
        verifierHost: "",
        verifierQRCodePath: "",
        requestUri: ""
    },
    MATOMO_TRACKER_URL: "",
    MATOMO_SITE_ID: "",
    TICKETING_SYSTEM_URL: "",
    KNOWLEDGE_BASE_URL: "https://knowledgebase.dome-marketplace.org/",
    SEARCH_ENABLED: true,
    PURCHASE_ENABLED: true,
    DOME_TRUST_LINK: "",
    DOME_ABOUT_LINK: '',
    DOME_REGISTER_LINK: '',
    DOME_PUBLISH_LINK:'',
    DOME_LINKEDIN: 'https://www.linkedin.com/company/dome-marketplace/',
    DOME_YOUTUBE: 'https://www.youtube.com/channel/UC8UiL59S0JiaYYr14w5eOzA',
    DOME_X: 'https://x.com/DomeMarketplace',
    BUNDLE_ENABLED: false,
    MAX_FILE_SIZE:3145728
};
