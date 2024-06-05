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
    //API PAGINATION
    PRODUCT_LIMIT: 6,
    CATALOG_LIMIT: 8,
    INVENTORY_LIMIT: 6,
    PROD_SPEC_LIMIT: 6,
    SERV_SPEC_LIMIT: 6,
    RES_SPEC_LIMIT: 6,
    ORDER_LIMIT: 6,
    CATEGORY_LIMIT: 100,
    //SIOP: true,
    SIOP: false,
    TAX_RATE: 20,
    CHAT_API: 'http://85.215.243.214:5000/predict',
    SIOP_INFO: {
        enabled: false,
        pollPath: "",
        pollCertPath: "",
        clientID: "",
        callbackURL: "",
        verifierHost: "",
        verifierQRCodePath: "",
    }
};
