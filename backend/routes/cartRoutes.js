const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔧 Helper function to fetch a cart by either userId (logged in) or guestId (non-logged in)
const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

//Add a product to the cart for a guest or logged in user
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    //check user or guest logged
    let cart = await getCart(userId, guestId);

    // If cart exists, check if product with same ID + size + color already exists
    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      ); 
      // productIndex Returns the index of the matching product if found.   Returns -1 if no match is found.

      if (productIndex > -1) {
        // ✅ Product already in cart → increase quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // 🆕 Add new product variation
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }
      // Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      // 🔨 No cart → create a new cart for the guest or user
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//Update product quantity in the cart for a guest or logged-in user
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIndex > -1) {
      //update quantity
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1); // remove product if quantity is 0
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// remove product from cart
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// get logged-in or guest users cart
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;
  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//merge guest cart into user cart on login
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;
  try {
    
    const guestCart = await Cart.findOne({ guestId }); // 🛒 Get the guest cart by guestId
    const userCart = await Cart.findOne({ user: req.user._id }); // 🛒 Get the logged-in user's cart by their user ID (req.user._id comes from protect middleware)
    if (guestCart) {  // 🧪 If the guest cart exists...
      if (guestCart.products.length === 0) {
        return res.status(400).json({ message: "Guest cart is empty" }); // ❌ If guest cart is empty, no need to merge
      }
      if (userCart) { // ✅ If the logged-in user already has a cart...
        guestCart.products.forEach((guestItem) => {   // Loop through each product in the guest cart
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );
          if (productIndex > -1) {
            // 🔁 If the product (with same ID, size, and color) exists in user's cart
            // ➕ Add guest item quantity to existing item
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            // ➕ If item doesn't exist in userCart, add it from guestCart
            userCart.products.push(guestItem);
          }
        });

         // 💰 Recalculate the total price of the user cart after merging
        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        await userCart.save();
          
        // 🧹 Try deleting the guest cart from DB
        try {
          await Cart.findOneAndDelete({ guestId });
        } catch (error) {
          console.log("Error deleting guest cart", error);
        }
        res.status(200).json(userCart);
      } else {
        // 🆕 If user has no cart yet, assign the guest cart to the logged-in user
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();

        res.status(200).json(guestCart);
      }
    } else {
      if (userCart) {
        // guest cart has a already been merged return user cart
        return res.status(200).json(userCart);
      }
      res.status(404).json({ message: "Guest cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
