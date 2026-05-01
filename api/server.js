import express from 'express';
import Product from './models/product.js';

const app = express();
const port = 3000;
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();

        res.send({
            data: products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);

        res.status(500).json({
            error: 'An error occurred while fetching products.',
        });
    }
})
//Product Routes
app.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({
      success: true,
      message: `Product dengan id ${product.id} berhasil ditambahkan`,
      data: product
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json({
      success: true,
      message: "Semua product berhasil diambil",
      data: products
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product tidak ditemukan" });
    }
    return res.status(200).json({
      success: true,
      message: `Product dengan id ${req.params.id} berhasil diambil`,
      data: product
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product tidak ditemukan" });
    }
    await product.update(req.body);
    return res.status(200).json({
      success: true,
      message: `Product dengan id ${req.params.id} berhasil diupdate`,
      data: product
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product tidak ditemukan" });
    }
    await product.destroy();
    return res.status(200).json({
      success: true,
      message: `Product dengan id ${req.params.id} berhasil dihapus`
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})