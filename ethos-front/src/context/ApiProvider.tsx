import React, { createContext, useContext, useCallback, useMemo } from 'react';
import EthosApiClient from '../EthosApiClient';

export const ApiContext = createContext<EthosApiClient | null>(null)

export function ApiProvider({ children, onError }: React.PropsWithChildren<{ onError?: (error: any) => void; }>) {
    
    const api = useMemo(() => new EthosApiClient(onError), [onError]);
    return (
        <ApiContext.Provider value={api}>
            {children}
        </ApiContext.Provider>
    
    )

}

export default ApiProvider;