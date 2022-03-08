process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if (process.env.NODE_ENV === 'dev') {
    process.env.URLDB = "mongodb://localhost:27017/erp_users";
} else {
    process.env.URLDB = "mongodb://localhost:27017/erp_users";
}

process.middlewares = [];