const express = require("express")
const adminRouter = express.Router()
const multer = require("multer")
const { cloudinary } = require("../cloudinary")
const {requireSign }= require("../middlewares/auth.middlewares")
const Song = require("../models/songs.model")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
adminRouter.post(
  "/add-song",
  requireSign,
  upload.single("file"),
  async (req, res) => {
    try {
      cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: "banikUdemy",
          use_filename: true,
          resource_type: "raw",
        },
        async (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Something went wrong" });
          } else {
            const newsong = new Song({
              title: req.body.title,
              artist: req.body.artist,
              src: result.url,
              album: req.body.album,
              duration: req.body.duration,
              year: req.body.year,
            });
            await newsong.save();
            const allSongs = await Song.find();
            res.status(200).send({
              message: "Song added successfully",
              success: true,
              data: allSongs,
            });
          }
        }
      );
    } catch (error) {
      res.status(500).send({
        message: "Error adding song",
        success: false,
        data: error,
      });
    }
  }
);


module.exports = adminRouter