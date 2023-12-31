// @ts-nocheck
import { useEffect, useState } from "react";
import { json, redirect} from "@remix-run/node";
import {
    Form,
    useActionData,
    useLoaderData,
    useNavigation,
    useSubmit,
} from "@remix-run/react";
// @ts-ignore
import {
    Page,
    Layout,
    Text,
    VerticalStack,
    Card,
    Button,
    HorizontalStack,
    Box,
    Divider,
    List,
    Link,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";
export const loader = async ({ request }) => {
    const { session } = await authenticate.admin(request);

    return json({ shop: session.shop.replace(".myshopify.com", "") });
};



// const UPDATE_PRODUCT_MUTATION = `mutation productVariantUpdate($input: ProductVariantInput!) {
//     productVariantUpdate(input: $input) {
//         productVariant {
//             id
//             title
//             inventoryPolicy
//             inventoryQuantity
//             price
//             compareAtPrice
//         }
//         userErrors {
//             field
//             message
//         }
//     }
// }`,
// variables: {
//     input: {
//         id: id,
//         price: parseFloat(price),
//     },
// },




export async function action({ request }) {
    const { admin } = await authenticate.admin(request);
    // const id = "gid://shopify/ProductVariant/46521029198099";
    // const price = 3431.00;
    const formData = await request.formData();
    console.log(formData);
    const id = formData.get("id");
    const price = Number(formData.get("price"));

    const response = await admin.graphql(
        `#graphql
        mutation productVariantUpdate($input: ProductVariantInput!) {
            productVariantUpdate(input: $input) {
                productVariant {
                    id
                    title
                    inventoryPolicy
                    inventoryQuantity
                    price
                    compareAtPrice
                }
                userErrors {
                    field
                    message
                }
            }
        }`,
        {
            variables: {
                input: {
                    id: id,
                    price: parseFloat(price),
                },
            },
        }
    );
    if (response.ok) {
        console.log("ok" + id + price);
    }
    else {
        console.log("ok" + id + price);
    }
    const responseJson = await response.json();

    return null;

}



export default function Task() {
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [newPrice, setNewPrice] = useState(0);


    const selectProduct = async () => {
        // console.log("selected");
        const selected = await shopify.resourcePicker({ type: 'product', action: 'select' });
        console.log(selected);
        console.log(selected[0].variants[0].id)
        // @ts-ignore
        setSelectedProduct(selected);
    }

    // const submit = useSubmit();
    // const handlePriceUpdate = () => submit({}, { replace: true, method: "POST" });
    return (
        <Form method="post" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", margin: "20px" }}>
            <div>Select the Products and update its price</div>
            <button onClick={selectProduct}>
                select a product
            </button>
            {selectedProduct.length >= 1 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                    <h2>{
                        selectedProduct[0].title}</h2>
                    <p>Price: ${
                        selectedProduct[0].variants[0].price}</p>
                    <input type="hidden" name="id" defaultValue={selectedProduct[0].variants[0].id} />
                    <input
                        type="number"
                        name="price"
                        value={newPrice}
                        onChange={(e) => { setNewPrice(e.target.value); console.log(newPrice + selectedProduct[0].variants[0].id) }}
                        style={{ width: "50%" }}
                    />
                    <p>new Price : ${newPrice}</p>
                    <button type="submit">Update Price</button>
                    {/* <button type="submit" onClick={handlePriceUpdate}>Update Price</button> */}
                    {/* <p>{console.log("triggered")}</p> */}
                </div>
            )}
        </Form>
    );
};