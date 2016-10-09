import { Toaster } from './toaster';
import { BroadcastService } from './broadcast.service';
import { CachingService } from './caching.service';
import { Entity } from './core.models';
import { Query } from './query';
import { StorageService } from './storage.service';
import { autoinject } from 'aurelia-dependency-injection';
import { HttpClient, json, RequestInit } from 'aurelia-fetch-client';
import appConfig from '../config';

@autoinject()
export abstract class ApiService<T extends Entity> {

    protected resource: string;
    protected model: T;
    protected useCache: boolean = false;
    protected notifyOnCreate = false;
    protected notifyOnUpdate = false;
    protected notifyOnDelete = false;

    constructor(
        protected http: HttpClient,
        protected broadcastService: BroadcastService,
        protected cachingService: CachingService,
        protected storageService: StorageService,
        protected toaster: Toaster
    ) {
        this.configure(storageService);
    }

    getAll(query?: Query, withEntity: boolean = true): Promise<T[]> {
        let url = this.resource;
        if (query) {
            url += query.serialize();
        }
        if (this.useCache) {
            let cache = this.getCachedContent(url);
            if (cache instanceof Promise) {
                return cache;
            }
        }
        let entity = (withEntity) ? this.model : undefined;
        return this.request(url, Method.GET, entity);
    }

    getById(id: string, withEntity: boolean = true, cacheId?: string): Promise<T> {
        let url = this.resource + "/" + id;
        if (this.useCache) {
            let cache = this.getCachedContent(url);
            if (cache instanceof Promise) {
                return cache;
            }
        }
        let entity = (withEntity) ? this.model : undefined;
        return this.request(url, Method.GET, entity, cacheId);
    }

    save(entity: T): Promise<T> {
        let method = entity._id ? Method.PUT : Method.POST;
        let url = this.resource;
        if (entity._id) {
            url += "/" + entity._id;
        }
        entity.beforeSave();
        return this.request(url, method, entity);
    }

    remove(id: string): Promise<Response> {
        let url = `${this.resource}/${id}`;
        return this.request(url, Method.DELETE);
    }

    request(url: string, method: string = Method.GET, entity?: T, cacheId?: string): Promise<T | T[]> {
        let config = this.getConfig(method, entity);
        return this.http
            .fetch(url, config)
            .then(r => (r.status === 204) ? r : r.json())
            .then(data => {
                // map to entity and store in cache
                if (method === Method.GET && entity)
                    data = this.mapToEntity(data);
                if (method === Method.GET && this.useCache)
                    this.cachingService.set(url, data);
                return data;
            })
            .then((data) => {
                // handle toasting notifications
                if (method === Method.POST && this.notifyOnCreate)
                    this.toaster.info("Entity created!");
                if (method === Method.PUT && this.notifyOnUpdate)
                    this.toaster.info("Entity updated!");
                if (method === Method.DELETE && this.notifyOnDelete)
                    this.toaster.info("Entity deleted!");
                return data;
            })
            .catch((err: Response) => {
                console.log(err);
                return err.text().then(text => {
                    this.toaster.error(text);
                    if (err.status === 401)
                        this.broadcastService.publish(BroadcastService.UNAUTHORIZED, text);
                    throw new Error(text);
                });
            });
    }

    protected getConfig(method: string = Method.GET, entity?: T): RequestInit {
        let config: RequestInit = {
            method: method,
            mode: "cors"
        };
        if (entity && method !== Method.GET)
            config.body = json(entity);
        return config;
    }

    protected createQuery(): Query {
        return new Query();
    }

    private mapToEntity(data: any): any {
        let result;
        if (data instanceof Array) {
            result = [];
            data.forEach((entry) => {
                let e: Entity = this.model.clone(this.model, true);
                e.initData(entry);
                result.push(e);
            });
        } else {
            let e: Entity = this.model.clone(this.model, true);
            e.initData(data);
            result = e;
        }
        return result;
    }

    private getCachedContent(cacheId: string): Promise<any> | undefined {
        let content = this.cachingService.get(cacheId);
        if (!content)
            return undefined;
        return new Promise((resolve) => resolve(content));
    }

    private configure(storageService) {
        this.http.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl(appConfig.baseUrl)
                .rejectErrorResponses()
                .withDefaults({
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'Fetch',
                        'Content-Type': 'application/json'
                    }
                })
                .withInterceptor({
                    request(request) {
                        let token = storageService.get(StorageService.TOKEN);
                        if (token)
                            request.headers.set('Authorization', "Bearer " + token);
                        return request;
                    }
                });
        });
    }
}

export class Method {
    static GET: string = "GET";
    static PUT: string = "PUT";
    static POST: string = "POST";
    static DELETE: string = "DELETE";
}