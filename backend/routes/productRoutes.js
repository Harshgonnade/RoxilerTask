const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const axios = require('axios');

// Seed database from third-party API
router.get('/seed', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Product.insertMany(response.data);
        res.status(200).json({ message: 'Database seeded successfully!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Transactions listing with search and pagination
router.get('/transactions', async (req, res) => {
    const { search = '', month, page = 1, perPage = 10 } = req.query;

    const startDate = new Date(`${month} 1, 2023`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const query = search
        ? {
              $and: [
                  { dateOfSale: { $gte: startDate, $lt: endDate } },
                  {
                      $or: [
                          { title: { $regex: search, $options: 'i' } },
                          { description: { $regex: search, $options: 'i' } },
                          { price: parseFloat(search) || -1 },
                      ],
                  },
              ],
          }
        : { dateOfSale: { $gte: startDate, $lt: endDate } };

    const total = await Product.countDocuments(query);
    const transactions = await Product.find(query)
        .skip((page - 1) * perPage)
        .limit(parseInt(perPage));

    res.json({ total, transactions });
});

// Statistics
router.get('/statistics', async (req, res) => {
    const { month } = req.query;

    const startDate = new Date(`${month} 1, 2023`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const totalSales = await Product.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate }, sold: true } },
        { $group: { _id: null, totalAmount: { $sum: '$price' }, totalItems: { $sum: 1 } } },
    ]);

    const notSoldCount = await Product.countDocuments({
        dateOfSale: { $gte: startDate, $lt: endDate },
        sold: false,
    });

    res.json({
        totalSalesAmount: totalSales[0]?.totalAmount || 0,
        totalSoldItems: totalSales[0]?.totalItems || 0,
        totalNotSoldItems: notSoldCount,
    });
});

// Bar chart data
router.get('/bar-chart', async (req, res) => {
    const { month } = req.query;

    const startDate = new Date(`${month} 1, 2023`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const ranges = [
        { label: '0-100', min: 0, max: 100 },
        { label: '101-200', min: 101, max: 200 },
        { label: '201-300', min: 201, max: 300 },
        { label: '301-400', min: 301, max: 400 },
        { label: '401-500', min: 401, max: 500 },
        { label: '501-600', min: 501, max: 600 },
        { label: '601-700', min: 601, max: 700 },
        { label: '701-800', min: 701, max: 800 },
        { label: '801-900', min: 801, max: 900 },
        { label: '901-above', min: 901, max: Infinity },
    ];

    const data = await Promise.all(
        ranges.map(async (range) => {
            const count = await Product.countDocuments({
                dateOfSale: { $gte: startDate, $lt: endDate },
                price: { $gte: range.min, $lt: range.max },
            });
            return { range: range.label, count };
        })
    );

    res.json(data);
});

module.exports = router;
