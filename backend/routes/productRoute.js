express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const multer = require('multer');
// const upload = multer({dest:'uploads/'});


// image or file upload config start
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'application/octet-stream' ||file.mimetype === 'image/jpeg' ||file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });
  const fields = [{name:'image'}];

// product
router.get('/', async (req, res) => {
    try {
        let data = await Product.find({});
        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
});

router.get('/web', async (req, res) => {
    try {
        let category = await Category.find({});
        let data = await Product.find({}).populate('category_id');
        res.render('product', {data:data, category: category})
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
});

router.post('/', upload.fields(fields), async (req, res) => {
    var name = {en:req.body.nameEn,bn:req.body.nameBn};
    var product = new Product({
        name: name,
        image: req.files.image[0].path,
        price: req.body.price,
        category_id: req.body.category_id,
        quantity: req.body.quantity
    });

    product.save(function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).send({ message: "Some error occurred while creating the Product.", err });
        } else {
            res.send(data);
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.send({message: "Successfully delete"});
            console.log(req.params.id);
        }
        else { console.log('Error in delete :' + err); }
    });
});


module.exports = router;