// @ts-nocheck
import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import {
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

// const UPDATE_PRODUCT_MUTATION = `
//   mutation updateProduct($input: ProductInput!) {
//       productUpdate(input: $input) {
//         product {
//           id
//           title
//           variants (first: 1) {
//             edges {
//               node {
//                 id
//                 price
//               }
//             }
//           }
//         }
//       }
//     }
//     `;

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
    const id = "gid://shopify/ProductVariant/46521029198099";
    const price = 32.00;

    console.log("id is" + id);
    console.log("price is " + price);

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
    const responseJson = await response.json();

    return json({
        product: responseJson.data,
    });
}



export default function Task() {
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [newPrice, setNewPrice] = useState('');

    // const [selectedProductId, setProductId] = useState('');
    // const [variants, setVariants] = useState([]);

    const selectProduct = async () => {
        // console.log("selected");
        const selected = await shopify.resourcePicker({ type: 'product', action: 'select' });
        console.log(selected);
        console.log(selected[0].id)
        // @ts-ignore
        setSelectedProduct(selected);
        // @ts-ignore
        // setProductId(selected[0].id);
        // setVariants(selected[0].variants);
    }
    const submit = useSubmit();
    const handlePriceUpdate = () => submit({}, { replace: true, method: "POST" });
    return (
        <>
            <div>Select the Products and update its price Taskkk </div>
            <button variant="primary" onClick={selectProduct}>
                select a product
            </button>
            {selectedProduct.length >= 1 && (
                <div>
                    <h2>{
                        selectedProduct[0].title}</h2>
                    <p>Price: ${
                        selectedProduct[0].variants[0].price}</p>
                    <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                    />
                    {/* <button>Update Price</button> */}
                    <button onClick={handlePriceUpdate}>Update Price</button>
                    {/* <p>{console.log("triggered")}</p> */}
                </div>
            )}
        </>
    );
};