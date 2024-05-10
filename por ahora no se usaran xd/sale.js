class SaleDetail {
  static _line = 0;

  constructor(product, quantity) {
    SaleDetail._line += 1;
    this.__id = SaleDetail._line;
    this.product = product;
    this.preci = product.preci;
    this.quantity = quantity;
  }

  get id() {
    return this.__id;
  }

  toString() {
    return `${this.id} ${this.product.descrip} ${this.preci} ${this.quantity}`;
  }
}

class Sale {
  static next = 0;
  static FACTOR_IVA = 0.12;

  constructor(client) {
    Sale.next += 1;
    this.__invoice = Sale.next;
    this.date = new Date().toISOString().slice(0, 10); // Obtener la fecha actual en formato YYYY-MM-DD
    this.client = client;
    this.subtotal = 0;
    this.percentage_discount = client.discount;
    this.discount = 0;
    this.iva = 0;
    this.total = 0;
    this.sale_detail = [];
  }

  get invoice() {
    return this.__invoice;
  }

  toString() {
    return `Factura# ${this.invoice} ${this.date} ${this.client.fullName()} ${this.total}`;
  }

  cal_iva(iva = 0.12, valor = 0) {
    return Math.round(valor * iva * 100) / 100;
  }

  cal_discount(valor = 0, discount = 0) {
    return valor * discount;
  }

  add_detail(prod, qty) {
    const detail = new SaleDetail(prod, qty);
    this.subtotal += Math.round(detail.preci * detail.quantity * 100) / 100;
    this.discount = this.cal_discount(this.subtotal, this.percentage_discount);
    this.iva = this.cal_iva(Sale.FACTOR_IVA, this.subtotal - this.discount);
    this.total = Math.round((this.subtotal + this.iva - this.discount) * 100) / 100;
    this.sale_detail.push(detail);

    const new_invoice_data = this.getJson();
    const json_file = new JsonFileManager('path/to/invoices.json');
    json_file.update_invoice(new_invoice_data);
  }

  getJson() {
    const invoice = {
      "factura": this.invoice,
      "Fecha": this.date,
      "cliente": this.client.fullName(),
      "subtotal": this.subtotal,
      "descuento": this.discount,
      "iva": this.iva,
      "total": this.total,
      "detalle": []
    };
    for (const det of this.sale_detail) {
      invoice["detalle"].push({
        "producto": det.product.descrip,
        "precio": det.preci,
        "cantidad": det.quantity
      });
    }
    return invoice;
  }
}
