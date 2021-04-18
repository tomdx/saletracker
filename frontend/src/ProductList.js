import React from "react";
import ProductBox from "./ProductBox";



class ProductList extends React.Component {
    async populateProducts() {
        let response = await fetch("http://localhost:5000/api/get-all-prices?user_id=debug").then(res => res.json())
        let i = 0;
        let products = {}
        for (const id in response) {
            if (i >= this.limit) {
                break;
            }
            console.log(i)
            let p;
            let lastprice = response[id].prices.pop();
            for (let pr in lastprice) {
                p = lastprice[pr];
            }
            products[i] = {
                exists: 'true',
                name: response[id].info.name,
                img_url: response[id].info.img_url,
                price: p
            }
            console.log(response)
            i++;
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
              name={this.state[i].name}
              img_url={this.state[i].img_url}
              price={"$" + parseInt(this.state[i].price, 10).toFixed(2)}/>)
        }
        return <div>{boxes}</div>
    }
}

export default ProductList