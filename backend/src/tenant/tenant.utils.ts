import { Connection, createConnection, getConnectionManager } from 'typeorm';
import { typeormConfig } from "../common/configs/typeorm"
import { Tenant } from './tenant.entity';

export const getTenantConnection = (tenant: Tenant, isLoadSeedersConfig: boolean = false): Promise<Connection> => {
    const connectionName = getTenantName(tenant.getName())
    const connectionManager = getConnectionManager()
    if (connectionManager.has(connectionName)) {
        const connection = connectionManager.get(connectionName)
        return Promise.resolve(connection.isConnected ? connection : connection.connect());
    }

    const config = typeormConfig(isLoadSeedersConfig)
    // @ts-ignore
    return createConnection({
        ...config,
        host: tenant.getHost(),
        database: connectionName,
        name: connectionName,
    })
}

export function getTenantName(tenantId: string) {
    return tenantId.startsWith("tenant") ? tenantId : `tenant_${tenantId}`
}