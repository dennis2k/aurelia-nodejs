export class StorageService {
    public static TOKEN: string = "aurelia_token";
    public static USER: string = "aurelia_user";

    public clear(): void {
        localStorage.clear();
    }

    public has(key: string): boolean {
        return localStorage.getItem(key) !== undefined;
    }

    public get<T>(key: string): T | undefined {
        let item = localStorage.getItem(key);
        let json;
        try {
            json = JSON.parse(item) as T;
        } catch (error) {
            json = item;
        }
        return (!item) ? undefined : json;
    }

    public key(index: number): string {
        return localStorage.key(index) as string;
    }

    public remove(key: string): void {
        return localStorage.removeItem(key);
    }

    public set(key: string, data: string): void {
        localStorage.setItem(key, JSON.stringify(data));
    }
}

