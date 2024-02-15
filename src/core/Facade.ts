
export class Facade {
  private static _allModels: Map<string, Function> = new Map<string, Function>();

  private static addModel(id: string, value: Function): void {
    Facade._allModels.set(id, value);
  }

  public static getModel<T extends any>(modelName: { new(...args: any[]): T; }): T {
    const model = Facade._allModels.get(modelName.name);
    if (!model) {
      throw new Error(`Model ${modelName} is not found`);
    } else {
      return model as T;
    }
  }

  /**
   * Create new entities here.
   * @param constructor - constructor of new Class
   * @param args - constructor params
   * use temp(MyClass); instead of newMyClass();
   */
  public static createInstance<T extends { new(...args: any[]): T; }, K extends any[]>(
    constructor: { new(...args: any[]): T; },
    args?: K
  ): T {
    let instance: T;
    if (this._allModels.has(constructor.name)) {
      console.warn(`Facade.createInstance: ${constructor.name} already exists`);
      return this._allModels.get(constructor.constructor.name)! as T;
    }
    if (!constructor) {
      throw new Error(`Constructor is ${constructor}`);
    }
    if (args) {
      instance = new (constructor)(...args);
    } else {
      instance = new (constructor)();
    }

    Facade.addModel(instance.constructor.name, instance);
    return instance;
  }

  public static addModels(models: [{ new(...args: any[]): any }, any[]][]): void {
    models.forEach((model) => {
      Facade.createInstance(...model);
    });
  }
}

