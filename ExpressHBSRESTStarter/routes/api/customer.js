var express = require('express');
var router = express.Router();
var repo = require('../../repository');

router.get('/', async function (req, res, next) {
     try {
          res.status(200);
          res.send(await repo.findAllCustomers());
     }
     catch (err) {
          console.log('Exception: ', err);
          res.status(500);
          res.send(200);
     }
});
router.post('/', async function (req, res, next) {
     try {
          var customer = {
               Id: -1,
               FirstName: req.body.FirstName,
               LastName: req.body.LastName,
               Address1: "4201 Disney Blvd. ",
               Address2: "Unit 100",
               Notes: "No notes",
               ZipCode: "32822",
               HomePhone: "4072581111",
               WorkPhone: "4072581111",
               CellPhone: "4073171111",
               EMail: req.body.EMail,
               CityId: 10,
               Active: true,
               ModifiedDt: "\/Date(1397410500000)\/",
               CreateDt: "\/Date(1397410500000)\/"
          };

          await repo.addCustomer(customer);
          //Send resource creatd and redirect
          res.redirect(201, '/');

     }
     catch (err) {
          console.log('Exception: ', err);
          res.status(500);
          res.send(200);
     }
});
router.get('/:id', async function (req, res, next) {
     try {
          res.status(200);
          res.send(await repo.findCustomerById(parseInt(req.params.id, 10)));
     }
     catch (err) {
          console.log('Exception: ', err);
          res.status(500);
          res.send(200);
     }
});

module.exports = router;