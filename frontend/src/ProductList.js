import React from "react";
import ProductBox from "./ProductBox";


export default function ProductList(props) {
  let boxes = []
  for (let i = 0; i < 40; i++) {
    boxes.push(
    <ProductBox
      exists={props.items[i].exists}
      vendor_name={props.items[i].vendor_name}
      name={props.items[i].name}
      img_url={props.items[i].img_url}
      price={"$" + parseInt(props.items[i].price, 10).toFixed(2)}
    />)
  }
  return <div>{boxes}</div>
}