const service = require('../service/mainService');
const express = require('express');
const router = express.Router();
 
router.get('/', function(req, res) {
    res.status(200)
        .json({mensagem:`Envio padrão`});

});

router.post('/', function(req, res) {
    service(req.body);
    res.status(200)
        .json({
            mensagem:`Envio padrão`,
            data: req.body
        });

});

module.exports = router;