const express = require("express");
const router = express.Router();
const link = require("../config/link");

router.get("/reservar", (req, res) => {
  try{
res.render("reservar", {datos: req.session, link})
  }
  catch{
    res.status(500).json({message:err.message});
  }
       
});


module.exports = router;
