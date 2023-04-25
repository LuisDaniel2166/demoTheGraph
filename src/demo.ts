import { near, BigInt, log, BigDecimal, JSONValue, JSONValueKind, json } from "@graphprotocol/graph-ts";
import { Profile, Book, Sale } from "../generated/schema";

export function handleReceipt(
  receipt: near.ReceiptWithOutcome
): void {
  const actions = receipt.receipt.actions;
  for (let i = 0; i < actions.length; i++) {
    handleAction(
      actions[i],
      receipt.receipt,
      receipt.block.header,
      receipt.outcome,
      receipt.receipt.signerPublicKey
    );
  }
}

function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  blockHeader: near.BlockHeader,
  outcome: near.ExecutionOutcome,
  publicKey: near.PublicKey
): void {
  if (action.kind !== near.ActionKind.FUNCTION_CALL) {
    log.info("Early return: {}", ["Not a function call"]);
    return;
  }

  const functionCall = action.toFunctionCall();

  if(functionCall.methodName == "create_profile"){
    //log.warning("Log:{}",[outcome.logs[0]])
    let name = ""
    let bio = ""
    let jsonData = outcome.logs[0]
    let parsedJSON = json.fromString(jsonData.replace("EVENT_JSON:", ""));
    let entry = parsedJSON.toObject();
    let data = entry.entries[0].value.toObject();
    for (let i = 0; i < data.entries.length; i++) {
      let key = data.entries[i].key.toString();
      //log.warning("Key:{} Pos:{}",[data.entries[i].key.toString(),i.toString()])
      switch (true) {
        case key == "bio":
          bio = data.entries[i].value.toString();
          break;
        case key == "name":
          name = data.entries[i].value.toString();
          break;
      }
    }
    let profile = Profile.load(receipt.signerId)
    if(profile == null){
      profile = new Profile(receipt.signerId)
    }
    profile.bio = bio
    profile.name = name
    profile.timestamp = BigInt.fromString(blockHeader.timestampNanosec.toString())
    profile.save()
  }

  if(functionCall.methodName == "create_book"){
    let author = ""
    let id = ""
    let description = ""
    let price = ""
    let stock = BigInt.zero()
    let title = ""
    let year  = BigInt.zero()
    let jsonData = outcome.logs[0]
    let parsedJSON = json.fromString(jsonData.replace("EVENT_JSON:", ""));
    let entry = parsedJSON.toObject();
    let data = entry.entries[0].value.toObject();
    for (let i = 0; i < data.entries.length; i++) {
      let key = data.entries[i].key.toString();
      switch (true) {
        case key == "author":
          author = data.entries[i].value.toString();
          break;
        case key == "book_id":
          id = data.entries[i].value.toI64().toString();
          break;
        case key == "description":
          description = data.entries[i].value.toString()
          break;
        case key == 'price':
          price = data.entries[i].value.toF64().toString()
          break;
        case key == 'stock':
          stock = data.entries[i].value.toBigInt()
          break;
        case key == 'title':
          title = data.entries[i].value.toString()
          break;
        case key == 'year':
          year = data.entries[i].value.toBigInt()
          break;
      }
    }
    let book = Book.load(id)
    if(book==null){
      book = new Book(id)
    }
    book.author = author
    book.description = description
    book.price = BigDecimal.fromString(price)
    book.stock = stock
    book.title = title
    book.year = year
    book.timestamp = BigInt.fromString(blockHeader.timestampNanosec.toString())
    book.save()
  }

  if(functionCall.methodName == "buy_book"){
    let owner = ""
    let id = ""
    let jsonData = outcome.logs[0]
    let parsedJSON = json.fromString(jsonData.replace("EVENT_JSON:", ""));
    let entry = parsedJSON.toObject();
    let data = entry.entries[0].value.toObject();
    for (let i = 0; i < data.entries.length; i++) {
      let key = data.entries[i].key.toString();
      switch (true) {
        case key == "owner":
          owner = data.entries[i].value.toString();
          break;
        case key == "book_id":
          id = data.entries[i].value.toI64().toString();
          break;
      }
    }
    let book = Book.load(id)
    if(book==null){
      book = new Book(id)
    }
    book.stock = BigInt.fromString((book.stock - BigInt.fromI32(1)).toString())
    let sale = new Sale(receipt.id.toHexString())
    sale.book = id
    sale.price = book.price
    sale.owner = owner
    sale.timestamp = BigInt.fromString(blockHeader.timestampNanosec.toString())
    book.save()
    sale.save()
  }

}
