const express = require('express');
const router = express.Router();
const axios = require('axios');
const customerRoute = '/api/customer/';

/* GET for add page. */
router.get('/add', function (req, res) {
    res.render('customeradd', { title: 'Add Customer', message: 'Hello', customer: { Id: 0, FirstName: '', LastName: '', EMail: '' } });
});

/* GET home page. */
router.get('/', async function (req, res, next) {
     let response = null;
     let json = {};
     let url = 'https://' + req.headers.host + customerRoute;

     try {
          response = await axios.get(url, { httpsAgent });
          json = response.data;
          if (response.status === 200) {
               res.render('customer', { title: 'Customer List', message: 'Hello', customers: json });
          }
          else
               console.log('Bad status code: ', response.status);
     }
     catch (error) {
          console.log('Error: ', error);
          next(error);
     }
});

/* GET by id page. */
router.get('/:id', async function (req, res, next) {
     let response = null;
     let json = {};
     let url = 'https://' + req.headers.host + customerRoute + req.params.id;

     try {
          response = await axios.get(url, { httpsAgent });
          json = response.data;
          if (response.status === 200) {
               res.render('customerdetail', { title: 'Customer Details', message: 'Hello', customer: json });
          }
          else
               console.log('Bad status code: ', response.status);
     }
     catch (error) {
          console.log('Error: ', error);
          next(error);
     }
});

module.exports = router;