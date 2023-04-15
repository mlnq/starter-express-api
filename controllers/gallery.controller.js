// GET /api/gallery
const Gallery = require("../models/gallery.model");
exports.getAllGallery = (req, res) => {
    Gallery.find().exec((err, gallery) => {
        console.log("gallery")
        if (err) {
            return res.status(500).send({article: err});
        }

        res.status(200).send(gallery);
    });
};


exports.createGallery = (req, res) => {
    const {description, author, files} = req.body;

    const newGallery = new Gallery({
        description,
        author,
        files,
    });

    newGallery.save((err, gallery) => {
        if (err) {
            return res.status(400).json({
                error: 'Nie można utworzyć galerii',
            });
        }
        res.json(gallery);
    });
};
