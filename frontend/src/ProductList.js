import React from "react";
import ProductBox from "./ProductBox";


class ProductList extends React.Component {
    async populateProducts() {
        let response = await fetch("http://localhost:5000/api/get-all-prices?user_id=debug").then(res => res.json())
        let i = 0;
        let products = {}
        for (const vendor_name in response) {
            console.log(vendor_name)
            let vendor = response[vendor_name]
            for (const id in vendor) {
                if (i >= this.limit) {
                    break;
                }
                let p;
                console.log(response)
                let lastprice = vendor[id].prices.pop()[1];
                products[i] = {
                    exists: 'true',
                    vendor_name: vendor_name,
                    name: vendor[id].info.name,
                    img_url: vendor[id].info.img_url,
                    price: lastprice,
                }
                console.log(response)
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
                price: '',
            }
        }
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
              price={"$" + parseInt(this.state[i].price, 10).toFixed(2)}/>)
        }
        return <div>{boxes}</div>
    }
}

export default ProductList