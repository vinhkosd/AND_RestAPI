var express = require('express');
var router = express.Router();
const categoryModel = require('../models/category');

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lấy danh sách loại sản phẩm
 *     responses:
 *       200:
 *         description: Trả về danh sách loại sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', async function(req, res, next) {
    var list = await categoryModel.find();
    res.json(list)
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Lấy thông tin loại sản phẩm theo ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của loại sản phẩm
 *         schema:
 *          $ref: '#/components/schemas/category'
 *     responses:
 *       200:
 *         description: Trả về thông tin của loại sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               category:
 *                type: object
 *               properties:
 *                id:
 *                 type: string
 *                 required: true
 *                name:
 *                 type: string
 *                 description: Tên loại sản phẩm
 * components:
 *   schemas:
 *     category:
 *       type: string
 *       required: true
 */
router.get('/:id', async function(req, res, next) {
    var productItem = await categoryModel.findById(req.params.id);
    if(!productItem) {
        next();
    }
    return productItem;
});

// Create a new product
router.post('/', async function(req, res, next) {
    const { name } = req.body;
    if(!name) {
        return res.status(400).send('Invalid data');
    }

    var productItem = await categoryModel.create({ name })
    res.send(productItem)
});

router.put('/:id(\\d+)', function(req, res, next) {
    res.send('Product updated')
});

router.delete('/:id(\\d+)', function(req, res, next) {
    var index = list.findIndex(product => product.id === parseInt(req.params.id));
    list.splice(index, 1);
    res.send(list)
});

module.exports = router;
