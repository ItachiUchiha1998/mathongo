const router = require('express').Router();
const models = require('./../db/models').models;

router.get('/local', function (req, res) {
    req.user = null;
    req.logout();
    req.session.destroy(function (err) {
        res.send({url: '/'});
    });
});

router.get('/', function (req, res) {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(' ')[1];
        models.AuthToken.destroy({
            where: {
                token: token
            }
        }).then(function () {
            res.send({success: 'true', url: '/'});
        }).catch(function (err) {
            console.log(err);
            res.send("Could not logout");
        })
    } else {
        console.log(req.headers.authorization);
        res.send({success: 'true', url: '/'});
    }
});

module.exports = router;