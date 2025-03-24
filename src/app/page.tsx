"use client"


import {Provider} from "react-redux";
import {store} from "@/app/store/storeProvider";
import Homepage from "@/app/views/home/page";

export default function Home() {
    return (
        <Provider store={store}>
            <Homepage/>
        </Provider>
    )
}