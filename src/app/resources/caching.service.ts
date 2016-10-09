export class CachingService {
    private static store: ICacheStore = {};

    public has(key: string): boolean {
        return CachingService.store[key] != undefined;
    }

    public get(key: string): any {
        return CachingService.store[key];
    }

    public set(key: string, data: any): void {
        CachingService.store[key] = data;
    }

    public clear(key: string): void {
        delete CachingService.store[key];
    }

    public clearAll(): void {
        CachingService.store = {};
    }
}

interface ICacheStore {
    [key: string]: any;
}
