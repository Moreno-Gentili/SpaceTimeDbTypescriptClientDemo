// THIS FILE IS AUTOMATICALLY GENERATED BY SPACETIMEDB. EDITS TO THIS FILE
// WILL NOT BE SAVED. MODIFY TABLES IN YOUR MODULE SOURCE CODE INSTEAD.

/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import {
  AlgebraicType,
  AlgebraicValue,
  BinaryReader,
  BinaryWriter,
  CallReducerFlags,
  ConnectionId,
  DbConnectionBuilder,
  DbConnectionImpl,
  DbContext,
  ErrorContextInterface,
  Event,
  EventContextInterface,
  Identity,
  ProductType,
  ProductTypeElement,
  ReducerEventContextInterface,
  SubscriptionBuilderImpl,
  SubscriptionEventContextInterface,
  SumType,
  SumTypeVariant,
  TableCache,
  TimeDuration,
  Timestamp,
  deepEqual,
} from "@clockworklabs/spacetimedb-sdk";
import { EntityKind as __EntityKind } from "./entity_kind_type";
import { EntityState as __EntityState } from "./entity_state_type";
import { Vector3 as __Vector3 } from "./vector_3_type";

export type Movable = {
  name: string,
  kind: __EntityKind,
  state: __EntityState,
  position: __Vector3,
  velocity: __Vector3,
};

/**
 * A namespace for generated helper functions.
 */
export namespace Movable {
  /**
  * A function which returns this type represented as an AlgebraicType.
  * This function is derived from the AlgebraicType used to generate this type.
  */
  export function getTypeScriptAlgebraicType(): AlgebraicType {
    return AlgebraicType.createProductType([
      new ProductTypeElement("name", AlgebraicType.createStringType()),
      new ProductTypeElement("kind", __EntityKind.getTypeScriptAlgebraicType()),
      new ProductTypeElement("state", __EntityState.getTypeScriptAlgebraicType()),
      new ProductTypeElement("position", __Vector3.getTypeScriptAlgebraicType()),
      new ProductTypeElement("velocity", __Vector3.getTypeScriptAlgebraicType()),
    ]);
  }

  export function serialize(writer: BinaryWriter, value: Movable): void {
    Movable.getTypeScriptAlgebraicType().serialize(writer, value);
  }

  export function deserialize(reader: BinaryReader): Movable {
    return Movable.getTypeScriptAlgebraicType().deserialize(reader);
  }

}


