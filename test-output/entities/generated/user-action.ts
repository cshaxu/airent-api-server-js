import { getMax, getMin } from '../../../src';
import {
  UserFieldRequest,
  UserResponse,
  ManyUsersResponse,
  OneUserResponse,
} from './user-type';
import { UserEntity } from '../user';
import { UserModel } from './user-type';
import { UserService } from '../../../test-resources/user-service';
import {
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../../test-resources/user-type';

// api response builders

export async function buildManyUsersResponse(
  many: UserEntity[],
  fieldRequest: UserFieldRequest,
): Promise<ManyUsersResponse> {
  const users = await UserEntity.presentMany(many, fieldRequest);
  const createdAts = many.map((one) => one.createdAt);
  const minCreatedAt = getMin(createdAts);
  const maxCreatedAt = getMax(createdAts);
  const cursor = {
    count: many.length,
    minCreatedAt,
    maxCreatedAt,
 };
  return { cursor, users };
}

export async function buildOneUserResponse(
  one: UserEntity,
  fieldRequest: UserFieldRequest,
): Promise<OneUserResponse> {
  const user = await one.present(fieldRequest);
  return { user };
}

// api executors

export async function getManyUsers(
  query: GetManyUsersQuery,
  fieldRequest: UserFieldRequest,
): Promise<ManyUsersResponse> {
  const service = new UserService(
  );
  await service.beforeGetMany(query);
  const many = await service.getMany(query);
  await service.afterGetMany(many, query);
  return await buildManyUsersResponse(many, fieldRequest);
}

export async function getOneUser(
  params: GetOneUserParams,
  fieldRequest: UserFieldRequest,
): Promise<OneUserResponse> {
  const service = new UserService(
  );
  await service.beforeGetOne(params);
  const one = await service.getOne(params);
  await service.afterGetOne(one, params);
  return await buildOneUserResponse(one, fieldRequest);
}
      
export async function createOneUser(
  body: CreateOneUserBody,
  fieldRequest: UserFieldRequest,
): Promise<OneUserResponse> {
  const service = new UserService(
  );
  await service.beforeCreateOne(body);
  const one = await service.createOne(body);
  await service.afterCreateOne(one, body);
  return await buildOneUserResponse(one, fieldRequest);
}

export async function updateOneUser(
  params: GetOneUserParams,
  body: UpdateOneUserBody,
  fieldRequest: UserFieldRequest,
): Promise<OneUserResponse> {
  const service = new UserService(
 );
  const one = await service.getOne(params);
  await service.beforeUpdateOne(one, body);
  const updatedOne = await service.updateOne(one, body);
  await service.afterUpdateOne(updatedOne, body);
  return await buildOneUserResponse(updatedOne, fieldRequest);
}

export async function deleteOneUser(
  params: GetOneUserParams,
  fieldRequest: UserFieldRequest,
): Promise<OneUserResponse> {
  const service = new UserService(
  );
  const one = await service.getOne(params);
  await service.beforeDeleteOne(one);
  const deletedOne = await service.deleteOne(one);
  await service.afterDeleteOne(deletedOne);
  return await buildOneUserResponse(deletedOne, fieldRequest);
}
