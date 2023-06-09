// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Book extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("author", Value.fromString(""));
    this.set("description", Value.fromString(""));
    this.set("price", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("stock", Value.fromBigInt(BigInt.zero()));
    this.set("title", Value.fromString(""));
    this.set("year", Value.fromBigInt(BigInt.zero()));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Book entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Book entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Book", id.toString(), this);
    }
  }

  static load(id: string): Book | null {
    return changetype<Book | null>(store.get("Book", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get author(): string {
    let value = this.get("author");
    return value!.toString();
  }

  set author(value: string) {
    this.set("author", Value.fromString(value));
  }

  get description(): string {
    let value = this.get("description");
    return value!.toString();
  }

  set description(value: string) {
    this.set("description", Value.fromString(value));
  }

  get price(): BigDecimal {
    let value = this.get("price");
    return value!.toBigDecimal();
  }

  set price(value: BigDecimal) {
    this.set("price", Value.fromBigDecimal(value));
  }

  get stock(): BigInt {
    let value = this.get("stock");
    return value!.toBigInt();
  }

  set stock(value: BigInt) {
    this.set("stock", Value.fromBigInt(value));
  }

  get title(): string {
    let value = this.get("title");
    return value!.toString();
  }

  set title(value: string) {
    this.set("title", Value.fromString(value));
  }

  get year(): BigInt {
    let value = this.get("year");
    return value!.toBigInt();
  }

  set year(value: BigInt) {
    this.set("year", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}

export class Sale extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("book", Value.fromString(""));
    this.set("price", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("owner", Value.fromString(""));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Sale entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Sale entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Sale", id.toString(), this);
    }
  }

  static load(id: string): Sale | null {
    return changetype<Sale | null>(store.get("Sale", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get book(): string {
    let value = this.get("book");
    return value!.toString();
  }

  set book(value: string) {
    this.set("book", Value.fromString(value));
  }

  get price(): BigDecimal {
    let value = this.get("price");
    return value!.toBigDecimal();
  }

  set price(value: BigDecimal) {
    this.set("price", Value.fromBigDecimal(value));
  }

  get owner(): string {
    let value = this.get("owner");
    return value!.toString();
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}

export class Profile extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("name", Value.fromString(""));
    this.set("bio", Value.fromString(""));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Profile entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Profile entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Profile", id.toString(), this);
    }
  }

  static load(id: string): Profile | null {
    return changetype<Profile | null>(store.get("Profile", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    return value!.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get bio(): string {
    let value = this.get("bio");
    return value!.toString();
  }

  set bio(value: string) {
    this.set("bio", Value.fromString(value));
  }

  get books(): Array<string> {
    let value = this.get("books");
    return value!.toStringArray();
  }

  set books(value: Array<string>) {
    this.set("books", Value.fromStringArray(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}
