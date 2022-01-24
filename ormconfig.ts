import {ConnectionOptions} from "typeorm";

export default {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "etvapp",
    "password": "etvapp123456",
    "database": "etvapp",
    "entities": ["api/src/**/**.entity{.ts,.js}"],
    "synchronize": true
}as ConnectionOptions
