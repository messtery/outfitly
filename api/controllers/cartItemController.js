import Cart from '../models/cart.js';
import CartItem from '../models/cartitem.js';
import Product from '../models/product.js';

export const create = async (req, res) => {
  try {
    const customerId = req.user.id
    const { productId, qty } = req.body
    const [cart] = await Cart.findOrCreate({
      where: {
        customerId,
      },
    })

    const product = await Product.findByPk(productId)

    const [cartItem, created] = await CartItem.findOrCreate({
      where: {
        cartId: cart.id,
        productId: product.id,
      },
      defaults: {
        qty,
        price: product.price,
      },
    })

    if (!created) {
      await cartItem.increment('qty', { by: qty })
    }

    res.status(201).json({
      message: 'Cart created successfully',
      data: cart,
    })
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to create cart',
    });
  }
};

export const get = async (req, res) => {
  try {
    const customerId = req.user.id

    const cart = await Cart.findOne({
      where: {
        customerId
      },
    });

    if (!cart) {
      return res.status(404).json({
        status: 404,
        message: 'Cart not found',
      });
    }

    const cartItems = await CartItem.findAll({
      where: {
        cartId: cart.id,
      },
      include: [
        {
          model: Product,
          as: 'product',
        }
      ]
    })

    res.status(200).json({
      data: cartItems,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error fetching cart',
    });
  }
};

export const update = async (req, res) => {
  try {
    console.log(req.body);
    
    console.log('================================');
    
    const {id, qty} = req.body

    const cartItem = await CartItem.findByPk(id)
    const updatedCartItem = await cartItem.update({
      qty,
    })

    res.json({ data: updatedCartItem });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      message: 'Failed to update cart',
    });
  }
};

export const remove = async (req, res) => {
  try {
      const cartItem = await CartItem.findByPk(req.params.id);

      if (!cartItem) {
          return res.status(404).json({ message: 'Cart not found.' });
      }

      await cartItem.destroy();

      res.status(200).json({
        message: `Cart item with id ${req.params.id} deleted successfully.`,
      });
  } catch (error) {
      console.error('Error deleting cart:', error);
      res.status(500).json({
        message: 'An error occurred while deleting the cart.'
      });
  }
};