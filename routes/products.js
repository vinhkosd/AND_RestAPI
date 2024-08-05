var express = require('express');
var router = express.Router();
const productModel = require('../models/product');
const categoryModel = require('../models/category');

// Lấy thông tin tất cả các sản phẩm
router.get('/', async function(req, res, next) {
    var list = await productModel.find();
    res.json(list)
});
// Lấy tên và giá của tất cả các sản phẩm
router.get('/name-price', async function(req, res, next) {
    var list = await productModel.find().select('name price');
    res.json(list)
})

// Lấy thông tin sản phẩm theo ID
router.get('/:id', async function(req, res, next) {
    //check is objectId
    if(!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        next();
    } else {
        var productItem = await productModel.findById(req.params.id);
        if(!productItem) {
            return res.status(404).send('Product not found');
        }
        res.json(productItem);
    }
});
// Lấy thông tin các sản phẩm có giá trên 1000
router.get('/price-greater-than-1000', async function(req, res, next) {
    var list = await productModel.find({ price: { $gt: 1000 } });
    res.json(list)
})

// Lấy thông tin các sản phẩm thuộc loại 'Bánh'
router.get('/category/:category', async function(req, res, next) {
    var categoryCake = await categoryModel.find({ name: req.params.category });
    var list = await productModel.find({ category: categoryCake });
    res.json(list)
})

// Tạo product mới
router.post('/', async function(req, res, next) {
    const { name, price, quantity, image, category } = req.body;
    if(!name || !price || !quantity ||  typeof image == "undefined" || !category) {
        return res.status(400).send('Invalid data');
    }

    var productItem = await productModel.create({ name, price, quantity, image, category })
    res.send(productItem)
});

//Đếm số lượng sản phẩm trong mỗi loại (countDocuments)
router.get('/count-by-category', async function(req, res, next) {
    const list = await productModel.find({}, 'name price category').populate('category');
    
    var countDocuments = await productModel.countDocuments();
    
    res.status(200).json(list);
})

// Lấy thông tin sản phẩm có số lượng ít hơn 10

router.get('/quantity-less-than-10', async function(req, res, next) {
    var list = await productModel.find({ quantity: { $lt: 10 } });
    res.json(list)
})

// Cập nhật giá của sản phẩm theo ID, với giá người dùng truyền vào
router.put('/:id', async function(req, res, next) {
    const { price } = req.body;
    if(!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        next();
    } else {
        var oneProduct = await productModel.findById(req.params.id);

        if(!oneProduct) {
            return res.status(404).send('Product not found');
        }
    
        if(!price) {
            return res.status(400).send('Invalid data');
        }
    
        oneProduct.price = price;
    
        oneProduct.save();
        
        res.send('Product updated')
    }
   
});

//Xóa sản phẩm theo ID
router.delete('/:id', function(req, res, next) {
    if(!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        next();
    } else {
        productModel.findByIdAndDelete(req.params.id, function(err, docs) {
            if(err) {
                console.log(err);
                res.send(err);
            } else {
                res.send('Product deleted');
            }
        });
    }
});

//Lấy các sản phẩm có giá trong khoảng từ 500 đến 1500
router.get('/price-between-500-1500', async function(req, res, next) {
    var list = await productModel.find({ price: { $gte: 500, $lte: 1500 } });
    res.json(list)
})

//Lấy tên và số lượng của các sản phẩm có số lượng lớn hơn 20
router.get('/name-quantity-greater-than-20', async function(req, res, next) {
    var list = await productModel.find({ quantity: { $gt: 20 } }).select('name quantity');
    res.json(list)
})

// Lấy các sản phẩm có tên chứa từ khóa 'phone'
router.get('/name-contains-phone', async function(req, res, next) {
    var list = await productModel.find({ name: { $regex: 'phone', $options: 'i' } });
    res.json(list)
})

// Lấy thông tin sản phẩm đắt nhất
router.get('/most-expensive', async function(req, res, next) {
    var list = await productModel.find().sort({ price: -1 }).limit(1);
    res.json(list)
})

//Lấy thông tin sản phẩm rẻ nhất
router.get('/cheapest', async function(req, res, next) {
    var list = await productModel.find().sort({ price: 1 }).limit(1);
    res.json(list)
})

//Lấy giá trung bình của các sản phẩm
router.get('/average-price', async function(req, res, next) {
    var list = await productModel.find();
    var total = list.reduce((acc, curr) => acc + curr.price, 0);
    var average = total / list.length;
    res.json(average.toFixed(2))
})

//(*)Tính tổng giá trị của tất cả các sản phẩm (số lượng * giá)
router.get('/total-price', async function(req, res, next) {
    var list = await productModel.find();
    var total = list.reduce((prev, curItem) => prev + curItem.price * curItem.quantity, 0);
    res.json(total)
})

module.exports = router;
