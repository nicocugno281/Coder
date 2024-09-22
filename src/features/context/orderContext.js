import React, { createContext, useState } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderItems, setOrderItems] = useState([]);

    return (
        <OrderContext.Provider value={{ orderItems, setOrderItems }}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderContext;
