export const cartService = {
  async addToCart(productId) {
    const response = await fetch('http://localhost:3000/api/cart-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        productId,
        qty: 1,
      }),
    })

    return response.json();
  }
}