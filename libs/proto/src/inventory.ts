/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'inventory';

export interface ShowInventoryRequest {
  steamID: string;
}

export interface ShowInventoryResponse {
  inventory: Item[];
}

export interface Item {
  assetID: string;
  marketHashName: string;
}

export const INVENTORY_PACKAGE_NAME = 'inventory';

export interface InventoryServiceClient {
  getInventory(request: ShowInventoryRequest): Observable<ShowInventoryResponse>;
}

export interface InventoryServiceController {
  getInventory(
    request: ShowInventoryRequest,
  ): Promise<ShowInventoryResponse> | Observable<ShowInventoryResponse> | ShowInventoryResponse;
}

export function InventoryServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['getInventory'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('InventoryService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('InventoryService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const INVENTORY_SERVICE_NAME = 'InventoryService';
