import React, { useEffect } from "react"
import {
    Container, Row
} from "reactstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFoundProduct from "../components/NotFoundProduct";
import ListProduct from "../components/ListProduct";

const Catalog = ({ products }) => {

    const getProductsClientSide = () => {
        console.log(location.origin)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}products`, {
                headers: {
                    origin: location.origin
                }
            })
            .then(response => response.json())
            .then(console.log)
    }

    useEffect(() => {
        getProductsClientSide()
    }, [])

    return (
        <Container className="mt-2">
            <h1>Products</h1>
            <Row>
                {products.length === 0 &&
                    <NotFoundProduct />
                }
                <ListProduct products={products} />
            </Row>
        </Container>
    )
}

export async function getServerSideProps(context) {
    const origin = (
        context.req.headers["host"] ||
        context.req.headers["origin"] ||
        context.req.headers["referer"]
    );

    const products = await fetch(`${process.env.API_URL}products`, {
        headers: {
            origin
        }
    }).then(response => response.json())

    return {
        props: {
            products: products
        },
    }
}

export default Catalog;