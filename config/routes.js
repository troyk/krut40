var controllers = {},
    fs = require('fs');

// populate controllers
function populateControllers(controllerDir) {
  fs.readdirSync(controllerDir).forEach(function(filename){
    if (/\.js$/.test(filename)) {
      var name = filename.substr(0, filename.lastIndexOf('.'));
      controllers[name] = require(controllerDir + '/' + filename);
    }
  });
}


var exports = module.exports = function(app) {
  populateControllers(app.rootdir + '/app/controllers');
  
  app.get('/', controllers.users.messages); // root
  
  
  return;
  
  app.get('/login', controllers.users.login);
  app.post('/login', controllers.users.login);
  app.get('/login/reset/:token', controllers.users.reset_password);
  app.post('/login/reset/:token', controllers.users.reset_password);
  
  app.get('/orders', controllers.orders.index);
  app.get('/orders/:id', controllers.orders.show);
  app.get('/orders/all/shipments', controllers.orders.shipments);
  app.get('/orders/:id/shipment/:shipment_id', controllers.orders.show_shipment);
  
  app.get('/settings', controllers.users.settings);
  app.put('/settings', controllers.users.settings_update);
  
  // access to admin routes are restricted to admin users via cookieSession middleware
  // users
  app.get('/admin/users', controllers.admin.users_index);
  app.get('/admin/users/new', controllers.admin.users_new);
  app.get('/admin/users/:id/edit', controllers.admin.users_edit);
  app.post('/admin/users', controllers.admin.users_create);
  app.put('/admin/users/:id', controllers.admin.users_update);
  
  // messages
  app.get('/admin/messages', controllers.admin.messages_index);
  app.get('/admin/messages/new', controllers.admin.messages_new);
  app.get('/admin/messages/:id/edit', controllers.admin.messages_edit);
  app.post('/admin/messages', controllers.admin.messages_create);
  app.put('/admin/messages/:id', controllers.admin.messages_update);
  app.delete('/admin/messages/:id', controllers.admin.messages_delete);
  
  // products
  app.get('/admin/products', controllers.admin.products_index);
  app.get('/admin/products/new', controllers.admin.products_new);
  app.get('/admin/products/:id/edit', controllers.admin.products_edit);
  app.post('/admin/products', controllers.admin.products_create);
  app.put('/admin/products/:id', controllers.admin.products_update);
  app.delete('/admin/products/:id', controllers.admin.products_delete);
  
  
};