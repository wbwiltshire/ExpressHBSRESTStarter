var customers = [];

exports.loadCustomers = function (c) {
     customers = c;
};

exports.findAllCustomers = async function () {
     // return an async Promise and simulate network response time of 500ms
     return new Promise(function (resolve, reject) {
          setTimeout(function () {
               resolve(customers);
          }, 500);
     });
};

exports.findCustomerById = async function (id) {
     // return an async Promise and simulate network response time of 500ms
     return new Promise(function (resolve, reject) {
          setTimeout(function () {
               var customer = null;
               for (idx in customers) {
                    if (id === customers[idx].Id) {
                         customer = customers[idx];
                         break;
                    }
               }
               resolve(customer);
          }, 500);
     });
};

exports.addCustomer = async function (customer) {
     // return an async Promise and simulate network response time of 500ms
     return new Promise(function (resolve, reject) {
          setTimeout(function () {
               var id = customers.length + 1;
               customer.Id = id;

               resolve(customers.push(customer));
          }, 500);
     });
};