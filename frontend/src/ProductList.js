import React from "react";
import ProductBox from "./ProductBox";
import TrackForm from "./TrackForm";
import { withRouter } from "react-router-dom"
import PriceHistory from "./PriceHistory";


class ProductList extends React.Component {
  async populateProducts() {
    const { history } = this.props
    let response = await fetch("/api/get-all-prices", { credentials: 'include'}).then(res => res.json())
      .catch(() => history.push('/api/login'))
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
        let pricetimes = vendor[id].prices
        let prices = []
        let times = []
        for (let i = 0; i < pricetimes.length; i++) {
          times.push(pricetimes[i][0])
          prices.push(pricetimes[i][1])
        }
        let lastprice = prices[prices.length - 1]
        products[i] = {
          exists: 'true',
          vendor_name: vendor_name,
          name: vendor[id].info.name,
          img_url: vendor[id].info.img_url,
          id: id,
          price: lastprice,
          desc: vendor[id].info.desc,
          prices: prices,
          times: times,
          box_number: i
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
    this.state.prices = []
    this.state.times = []
    this.updateList = this.updateList.bind(this)
    this.removeProduct = this.removeProduct.bind(this)
    this.showGraph = this.showGraph.bind(this)
  }

  updateList() {
    this.populateProducts()
  }

  removeProduct(vendor_name, product_id) {
    let url = '/api/unlink-product?product_id=' + product_id + "&vendor_name=" + vendor_name
    fetch(url).then(() => this.populateProducts());
  }

  //showGraph(product_name, times, prices) {
  async showGraph(box_number) {
    let prices = this.state[box_number].prices
    let times = this.state[box_number].times
    let newstate = {
      prices: prices,
      times: times
    }
    console.log(prices)
    console.log(times)
    this.setState(newstate)
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
          showGraph={this.showGraph}
          box_number={this.state[i].box_number}
        />
      )
    }
    return (
      <div>
        <TrackForm updateList={this.updateList}/>
        {boxes}
        <PriceHistory times={this.state.times} prices={this.state.prices} />
      </div>
  )
  }
}

export default withRouter(ProductList)