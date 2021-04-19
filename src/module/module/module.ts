import { ConcreteDependencyToken, BindingFactory, DependencyToken} from '@perivel/verdic';
import { Repository } from '../../repository/repository.module';
import { DomainService } from '../../service/service.module';
import { AbstractFactory } from './../../factory/factory.module';
import { ModuleFactoryEntry } from '../module-entry/module-factory-entry';
import { ModuleInstanceEntry } from '../module-entry/module-instance-entry';
import { ModuleBindings } from '../types/module-bindings.type';
import { ModuleInstances } from '../types/module-instances.type';
import { ModuleInterface } from './module.interface';

/**
 * Module
 */

export abstract class Module implements ModuleInterface {

    private readonly _factoryBindings: Map<string, ModuleFactoryEntry<any>>;
    private readonly _serviceBindings: Map<string, ModuleFactoryEntry<any>>;
    private readonly _repositoryInstances: Map<string, ModuleInstanceEntry<any>>;
    private readonly _serviceInstances: Map<string, ModuleInstanceEntry<any>>;
    private readonly _path: string;

    constructor(path: string) {
        this._path = path;
        this._factoryBindings = new Map<string, ModuleFactoryEntry<any>>();
        this._serviceBindings = new Map<string, ModuleFactoryEntry<any>>();
        this._repositoryInstances = new Map<string, ModuleInstanceEntry<any>>();
        this._serviceInstances = new Map<string, ModuleInstanceEntry<any>>();

        // register bindings
        this.createdBindings();
    }

    /**
     * createBindings()
     * 
     * this is where we register our module bindings. 
     * 
     * use addFactoryBinding(), addRepository(), addServiceBinding(), and addServiceinstance()
     * to register module dependencies.
     */

    protected abstract createdBindings(): void;

    /**
     * factoryBindings()
     * 
     * gets the module's factory bindings.
     */

    public factoryBindings(): ModuleBindings {
        const factories = new Map<ConcreteDependencyToken<any>, BindingFactory<any>>();

        // create the bindings.
        this._factoryBindings.forEach(value => {
            factories.set(value.token(), value.factory());
        })

        return factories;
    }

    /**
     * path()
     * 
     * gets the path of the module.
     */

    public path(): string {
        return this._path;
    }

    /**
     * registerRepositoryInstance()
     * 
     * registers a repository instance.
     * @param token The token to attach the instance to.
     * @param instance The instance to attach.
     */

    public registerRepositoryInstance<T extends Repository>(token: DependencyToken<T>, instance: T): void {

        const id  = this.getIdFromToken(token);
        if (this._repositoryInstances.has(id)) {
            this._repositoryInstances.get(id)!.setInstance(instance);
        }
        else {
            throw new Error("Repository Not Found");
        }
    }

    /**
     * regosterServoceInstance()
     * 
     * registerServiceInstance() registers a service instance.
     * @param token the token to attach the instance to.
     * @param instance The instance to register.
     * @throws ServiceNotFoundException when the service cannot be found.
     */

    public registerServiceInstance<T extends DomainService>(token: DependencyToken<T>, instance: T): void {
        const id = this.getIdFromToken(token);
        
        if (this._serviceInstances.has(id)) {
            this._serviceInstances.get(id)!.setInstance(instance);
        } 
        else {
            throw new Error("Registration Not Found");
        }
    }

    /**
     * repositoryInstances()
     * 
     * gets the repository instances.
     */

    public repositoryInstances(): ModuleInstances {
        const instances = new Map<DependencyToken<any>, any>();

        this._repositoryInstances.forEach((value, key) => {
            if (value.hasInstance()) {
                instances.set(value.token(), value.instance());
            }
            else {
                throw new Error("Registration Not Found");
            }
        });

        return instances;
    }

    /**
     * serviceBindings()
     * 
     * gets the service bindings for the module.
     */

    public serviceBindings(): ModuleBindings {
        const services = new Map<ConcreteDependencyToken<any>, BindingFactory<any>>();

        // build bindings
        this._serviceBindings.forEach((value, key) => {
            services.set(value.token(), value.factory());
        });

        return services;
    }

    /**
     * serviceInstances()
     * 
     * gets the service instances.
     */

    public serviceInstances(): ModuleInstances {
        const instances = new Map<DependencyToken<any>, any>();

        this._serviceInstances.forEach((value, key) => {
            if (value.hasInstance()) {
                instances.set(value.token(), value.instance());
            }
            else {
                // no instance
                throw new Error("No Instance");
            }
        });

        return instances;
    }
    
    // ==============================
    // Helper functions
    // ==============================

    /**
     * addFactoryBinding()
     * 
     * adds a factory binding.
     * @param token the token
     * @param factory the factory.
     * @throw DuplicateBindingException when adding a duplicate binding.
     */

    protected addFactoryBinding<T extends AbstractFactory>(token: ConcreteDependencyToken<T>, factory: BindingFactory<T>) {
        const id = this.getIdFromToken(token);

        if (!this._factoryBindings.has(id)) {
            const entry = new ModuleFactoryEntry(token, factory);
            this._factoryBindings.set(id, entry);
        }
        else {
            // binding already exists.
            throw new Error("Duplicate Binding");
        }
    }

    /**
     * addRepository()
     * 
     * adds a repository entry to the module.
     * @param token the token to bind the repository to.
     * @throw DuplicateBindingException when attempting to add a duplicate repository entry.
     */

    protected addRepository<T extends Repository>(token: DependencyToken<T>): void {
        const id = this.getIdFromToken(token);

        if (!this._repositoryInstances.has(id)) {
            const entry = new ModuleInstanceEntry(token);
            this._repositoryInstances.set(id, entry);
        }
        else {
            // duplicate repository.
            throw new Error("Duplicate Binding");
        }
    }

    /**
     * addServiceBinding()
     * 
     * adds a service binding to the module.
     * @param token the token to bind the factory to.
     * @param factory the factory.
     */

    protected addServiceBinding<T extends DomainService>(token: ConcreteDependencyToken<T>, factory: BindingFactory<T>): void {
        const id = this.getIdFromToken(token);

        if (!this._serviceBindings.has(id)) {
            const entry = new ModuleFactoryEntry(token, factory);
            this._serviceBindings.set(id, entry);
        }
        else {
            // duplicate entry.
            throw new Error("Duplicate Binding");
        }
    }

    /**
     * addServiceInstance()
     * 
     * adds a service instance to the module.
     * @param token the token to register.
     * @throws DuplicateBindingException when attempting to register a service that already exists.
     * 
     */
    protected addServiceInstance<T>(token: DependencyToken<T>): void {
        const id = this.getIdFromToken(token);

        if (!this._serviceInstances.has(id)) {
            const entry = new ModuleInstanceEntry(token);
            this._serviceInstances.set(id, entry);
        }
        else {
            // duplicate binding.
            throw new Error("Duplicate binding");
        }
    }

    /**
     * getIdFromToken()
     * 
     * getIdFromToken() gets the id for a token.
     * @param token the token to derrive the name from
     * @returns the id of the token.
     */

    private getIdFromToken<T>(token: ConcreteDependencyToken<T>|DependencyToken<T>): string {
        return token.name;
    }
}