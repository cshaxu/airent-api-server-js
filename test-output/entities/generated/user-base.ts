import {
  AsyncLock,
  BaseEntity,
  EntityConstructor,
  LoadConfig,
  LoadKey,
  toArrayMap,
  toObjectMap,
} from 'airent';

/** generated */
import {
  UserFieldRequest,
  UserResponse,
  UserModel,
} from './user-type';

export class UserEntityBase extends BaseEntity<
  UserModel, UserFieldRequest, UserResponse
> {
  public id: string;
  public createdAt: Date;
  public name: string;
  public email: string;

  public constructor(
    model: UserModel,
    group: UserEntityBase[],
    lock: AsyncLock,
  ) {
    super(group, lock);

    this.id = model.id;
    this.createdAt = model.createdAt;
    this.name = model.name;
    this.email = model.email;

    this.initialize();
  }

  public async present(fieldRequest: UserFieldRequest): Promise<UserResponse> {
    return {
      id: fieldRequest.id === undefined ? undefined : this.id,
      createdAt: fieldRequest.createdAt === undefined ? undefined : this.createdAt,
      name: fieldRequest.name === undefined ? undefined : this.name,
      email: fieldRequest.email === undefined ? undefined : this.email,
    };
  }

  /** self loaders */

  public static async getOne<ENTITY extends UserEntityBase>(
    this: EntityConstructor<UserModel, ENTITY>,
    key: LoadKey
  ): Promise<ENTITY | null> {
    return await (this as any)
      .getMany([key])
      .then((array: ENTITY[]) => array.at(0) ?? null);
  }

  public static async getMany<ENTITY extends UserEntityBase>(
    this: EntityConstructor<UserModel, ENTITY>,
    keys: LoadKey[]
  ): Promise<ENTITY[]> {
    const models = [/* TODO: load models for UserEntity */];
    return (this as any).fromArray(models);
  }
}
