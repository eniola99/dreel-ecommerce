import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    // const cart = sessionStorage.getItem('cartItems');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    // if (cart) {
    //   setCartItems(cart);
    // }
  }, []);

  const login = (user) => {
    setCurrentUser(user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('cartItems');
  };

  let foundProduct;
  let index;

  const onAdd = (product, quantity, isAvailable) => {
    if (!isAvailable) {
      toast.error(`${product?.name} is out of stock`);
      return;
    }
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
      });

      setCartItems(updatedCartItems);
      // sessionStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } else {
      product.quantity = quantity;

      setCartItems([...cartItems, { ...product }]);
      // sessionStorage.setItem(
      //   'cartItems',
      //   JSON.stringify([...cartItems, { ...product }])
      // );
    }

    toast.success(`${qty} ${product.name} added to the cart.`);
  };

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );
    setCartItems(newCartItems);
    // sessionStorage.setItem('cartItems', JSON.stringify(newCartItems));
  };

  const toggleCartItemQuanitity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    index = cartItems.findIndex((product) => product._id === id);
    const newCartItems = cartItems.filter((item) => item._id !== id);

    if (value === 'inc') {
      setCartItems([
        ...newCartItems,
        { ...foundProduct, quantity: foundProduct.quantity + 1 },
      ]);
      // sessionStorage.setItem(
      //   'cartItems',
      //   JSON.stringify([
      //     ...newCartItems,
      //     { ...foundProduct, quantity: foundProduct.quantity + 1 },
      //   ])
      // );

      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === 'dec') {
      if (foundProduct.quantity > 1) {
        setCartItems([
          ...newCartItems,
          { ...foundProduct, quantity: foundProduct.quantity - 1 },
        ]);
        // sessionStorage.setItem(
        //   'cartItems',
        //   JSON.stringify([
        //     ...newCartItems,
        //     { ...foundProduct, quantity: foundProduct.quantity - 1 },
        //   ])
        // );

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;

      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        logout,
        login,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuanitity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
        currentUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
