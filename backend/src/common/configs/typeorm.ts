import { join } from "path"

const typeormConfig = (isLoadSeedersConfig: boolean = false) => {
    const config: { [key: string]: any } = {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: true,
        logging: process.env.ENV == 'dev' ? true : false,
        entities: [join(__dirname, '..', '..', './**/*.entity.js')],
    }

    if (!isLoadSeedersConfig) {
        config.migrations = [join(__dirname, '..', '..', './db/migrations/*.js')]
    } else {
        config.migrationsTableName = 'seeders';
        config.migrations = [join(__dirname,  '..', '..', './db/seeds/*.js')]
    }

    return config;
}

export { typeormConfig }