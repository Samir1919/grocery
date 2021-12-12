express = require('express');
const router = express.Router();
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


  router.get('/uploads', async (req,res,next)=>{
    
    var sId = await idName._id;
    // console.log(id);
    console.log(sId);
    res.json(idName._id);
});
  // image or file upload config end

router.get('/web', async (req,res,next)=>{
  try {
    let data = await Category.find({})
    .populate('parent_category');
    res.render('category',{data:data})
} catch (error) {
    console.log(error)
    res.status(500).send('Server error')
}
});

router.get('/', async (req, res) => {
    try {
        let data = await Category.find({})
        .populate('parent_category');
        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
});



const fields = [{name:'logo'},{name:'banner'}];

router.post('/', upload.fields(fields), async (req, res) => {

    // from mobile app parent category
    // if(req.body.sId != 'Main'){
    //   var idName = await Category.findOne({'name.en': {$regex: req.body.sId}});
    // }else{
    //   idName = 'Main';
    // }
    
    // from web form
    if(req.body.parent_category != 'Main'){
      var parent = req.body.parent_category;
    }else{
      parent = null;
    }
    
    var name = {en:req.body.nameEn,bn:req.body.nameBn};
    var cat = new Category({
        name: name,
        parent_category: parent,
        logo: req.files.logo[0].path,
        banner: req.files.banner[0].path,
    
    });

    cat.save(function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).send({ message: "Some error occurred while creating the category." });
        } else {
            console.log(data);
            res.send(data);
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.send({message: "Successfully delete"});
            console.log(req.params.id);
        }
        else { console.log('Error in delete :' + err); }
    });
});

module.exports = router;