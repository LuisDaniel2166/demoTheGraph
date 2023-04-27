//Importaciones necesarias para el desarrollo del mapeo
import { near, BigInt, log, BigDecimal, JSONValue, JSONValueKind, json } from "@graphprotocol/graph-ts";
//Importacion de los esquemas que hemos generado
import { Profile, Book, Sale } from "../generated/schema";

//Mapeo de la informacion mediante el receipt
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

//Declaracion de la funcion para realizar el mapeo de la informacion de la blockchain
function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  blockHeader: near.BlockHeader,
  outcome: near.ExecutionOutcome,
  publicKey: near.PublicKey
): void {
  //Si la accion no es function call cancelamos la ejecucion
  if (action.kind !== near.ActionKind.FUNCTION_CALL) {
    log.info("Early return: {}", ["Not a function call"]);
    return;
  }

  //Recuperamos la funcion ejecutada
  const functionCall = action.toFunctionCall();

  //Mapeo de la funcion create_profile
  if(functionCall.methodName == "create_profile"){
    //log.warning("Log:{}",[outcome.logs[0]])
    //Se realiza la declaracion de las variables que se van a recuperar
    let name = ""
    let bio = ""
    //Se recupera el log que se tiene en la transaccion de la blockchain
    let jsonData = outcome.logs[0]
    //Se convierte el log del estandar de eventos a JSON
    let parsedJSON = json.fromString(jsonData.replace("EVENT_JSON:", ""));
    //El JSON se convierte a objeto
    let entry = parsedJSON.toObject();
    //Extraemos el campo data del objeto del estandar de eventos
    let data = entry.entries[0].value.toObject();
    //Se declara un ciclo for para poder extraer la informacion
    for (let i = 0; i < data.entries.length; i++) {
      //Se declara la variable key para poder extraer el encabezado del objeto
      let key = data.entries[i].key.toString();
      //log.warning("Key:{} Pos:{}",[data.entries[i].key.toString(),i.toString()])
      //Se declara una estructura Switch para almacenar la informacion en sus correspondientes variables
      switch (true) {
        case key == "bio":
          bio = data.entries[i].value.toString();
          break;
        case key == "name":
          name = data.entries[i].value.toString();
          break;
      }
    }
    //Se realiza la carga del perfil del usuario con la persona que firmo la transaccion
    let profile = Profile.load(receipt.signerId)
    //Si este perfil no existe se genera uno nuevo
    if(profile == null){
      profile = new Profile(receipt.signerId)
    }
    //Se asignan los valores que se recuperaron del log
    profile.bio = bio
    profile.name = name
    profile.timestamp = BigInt.fromString(blockHeader.timestampNanosec.toString())
    //Se guardan los cambios realizados en la estructura
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
    //Se declara el valor BigDecimal mediante el string declarado anteriormente
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
    //Se asignan los valores de la relacion mediante el string obtenido con anterioridad
    sale.book = id
    sale.price = book.price
    sale.owner = owner
    sale.timestamp = BigInt.fromString(blockHeader.timestampNanosec.toString())
    book.save()
    sale.save()
  }

}
