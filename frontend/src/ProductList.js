import React from "react";
import ProductBox from "./ProductBox";
import TrackForm from "./TrackForm";


class ProductList extends React.Component {
  async populateProducts() {
    let response = await fetch("/api/get-all-prices", { credentials: 'include'}).then(res => res.json())
    let i = 0;
    let products = {}
    for (let i = 0; i < this.limit; i++) {
      products[i] = {
        exists: 'false',
        vendor_name: '',
        name: '',
        img_url: '',
        id: '',
        price: '',
        desc: '',
      }
    }
    for (const vendor_name in response) {
      let vendor = response[vendor_name]
      for (const id in vendor) {
        if (i >= this.limit) {
          break;
        }
        let p;
        let lastprice = vendor[id].prices.pop()[1];
        products[i] = {
          exists: 'true',
          vendor_name: vendor_name,
          name: vendor[id].info.name,
          img_url: vendor[id].info.img_url,
          id: id,
          price: lastprice,
          desc: vendor[id].info.desc,
        }
        i++;
      }
    }
    this.setState(products)
  }

  componentDidMount() {
    this.populateProducts()
  }

  constructor(props) {
    super(props);
    this.limit = 50;

    this.state = {}
    for (let i = 0; i < this.limit; i++) {
      this.state[i] = {
        exists: 'false',
        vendor_name: '',
        name: '',
        img_url: '',
        id: '',
        price: '',
        desc: '',
      }
    }
    this.updateList = this.updateList.bind(this)
    this.removeProduct = this.removeProduct.bind(this)
  }

  updateList() {
    this.populateProducts()
    console.log("updated apparently")
  }

  removeProduct(vendor_name, product_id) {
    let url = '/api/unlink-product?product_id=' + product_id + "&vendor_name=" + vendor_name
    fetch(url).then(() => this.populateProducts());
  }

  render() {

    let boxes = []
    for (let i = 0; i < this.limit; i++) {
      boxes.push(
        <ProductBox
          exists={this.state[i].exists}
          vendor_name={this.state[i].vendor_name}
          name={this.state[i].name}
          img_url={this.state[i].img_url}
          price={"$" + parseFloat(this.state[i].price, 10).toFixed(2)}
          product_id={this.state[i].id}
          desc={this.state[i].desc}
          removeProduct={this.removeProduct}
        />
      )
    }
    return (
      <div>
        <TrackForm updateList={this.updateList}/>
        {boxes}
      </div>
  )
  }
}

export default ProductList