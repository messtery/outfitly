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
  },

  async addToCartWithQty(productId, qty) {
    const response = await fetch('http://localhost:3000/api/cart-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({ productId, qty }),
    })
    return response.json();
  },

  async clearCart() {
    const res = await fetch('http://localhost:3000/api/cart-items', {
      headers: { 'Authorization': `Bearer ${localStorage.token}` },
    })
    const { data } = await res.json()
    if (!data || !data.length) return

    await Promise.all(
      data.map((item) =>
        fetch(`http://localhost:3000/api/cart-items/${item.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.token}` },
        })
      )
    )
  },
}