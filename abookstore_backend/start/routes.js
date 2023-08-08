"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.on("/roles").render("role.roles");
Route.on("/roles-create").render("role.create");
Route.on("/create-role").render("role.create-role");
Route.on("/unauthorized").render("error.un-authorized");

Route.get("/", ({ response }) => {
  response.redirect("/admin");
});

Route.group(() => {
  Route.get("/", "AdminController.index");
  Route.post("/login", "AdminController.login").as("admin.login");
  Route.on("/forgot-pass").render("auth/forgot-pass");
  Route.on("/verify").render("auth/verify");
  Route.on("/change-pass").render("auth/change-pass");
}).prefix("/admin");

Route.group(() => {
  // User Management Routes
  Route.get("/logout", "AdminController.logout");
  Route.get("/dashboard", "DashboardController.index");
  Route.get("/all-users", "UserController.index").as("user.all");
  Route.get("/create-user", "UserController.create");
  Route.post("/user-register", "AdminController.register")
    .validator("AdminRegistration")
    .as("user.register");
  Route.get("/user-edit/:id", "AdminController.edit");
  Route.post("/user-update", "AdminController.update");
  Route.post("/user-delete/:id", "AdminController.destroy");

  Route.resource("/category", "CategoryController");
  Route.resource("/stage", "StageController");
  Route.get("/stage-data/:id", "StageController.getStages");
  Route.get("/products/:page/:show?", "ProductController.index");

  // Product Manage
  Route.resource("/product", "ProductController");

  Route.get("/trash/product", "ProductController.trash");
  Route.get("/trash/product/:page/:show?", "ProductController.trash");
  Route.post("/products/trash-all", "ProductController.trashAll");
  Route.post("/products/restore-all", "ProductController.restoreAllFromTrash");
  Route.delete("/trash/product/:id", "ProductController.permanentlyDelete");
  Route.get("/trash-restore/product/:id", "ProductController.restoreFromTrash");

  Route.on("/promo").render("coupon/promo");
  Route.on("/promo-create").render("coupon/promo-create");
  Route.get("/orders/:page?/:show?", "OrderController.index");
  Route.get("/order/:id", "OrderController.show");
  Route.on("/single-order").render("order/single-order");
  Route.get(
    "/order-confirmation/:id/:status",
    "OrderController.OrderConfirm"
  ).as("/order-confirmation");
  Route.get("/order-categories/:status", "OrderController.orders");
  Route.get("/delivery", "DeliveryMethodController.index");
  Route.post("/delivery/create", "DeliveryMethodController.create");
  Route.get("/delivery/:id/edit", "DeliveryMethodController.edit");
  Route.get("/delivery/:id/delete", "DeliveryMethodController.delete");
  Route.post("/delivery/update", "DeliveryMethodController.update");
  Route.resource("promo-code", "PromoCodeController");
  Route.post("promo-code/search", "PromoCodeController.filter");
  // Filter Route are here
  Route.get("/all-filter", "FilterController.index");
  Route.get("/edit-filter/:type/:id", "FilterController.edit");
  Route.post("/update-filter/:type", "FilterController.update");
  Route.post("/delete-filter/:type/:id", "FilterController.delete");
  Route.get(
    "/product/status/:type/:page?/:show?",
    "ProductController.bookStatus"
  );
  Route.post("/product/search", "ProductController.searchBook");
  Route.resource("/customer", "CustomerController");
  Route.resource("/permission", "PermissionController");
})
  .prefix("/admin")
  .middleware(["auth:session", "hasPermission"]);

Route.group(() => {
  Route.get("/category", "CategoryController.allCategory");
  Route.post("/auth/register", "AuthController.register");
  Route.post("/auth/login", "AuthController.login");
  Route.post("/auth/reset-password", "AuthController.sendVerificationCode");
  Route.post("/auth/verify-code", "AuthController.verifyCode");
  Route.post("/auth/recover-password", "AuthController.recoverPassword");
  Route.get("/account-confirm/:token", "AuthController.confirmToken");

  // Route.get('/user/:id', 'UserController.getUser')

  Route.get("/stage/:id", "StageController.getBooks");
  Route.get("/discipline/:id", "DisciplineController.getBooks");
  Route.get("/author/:id", "AuthorController.getBooks");
  Route.get("/publisher/:id", "PublisherController.getBooks");
  Route.get("/publishing-year/:id", "PublishingYearController.getBooks");
  Route.get("/language/:id", "LanguageController.getBooks");

  Route.get(
    "/product/all-books/:page/:show/:keyword?",
    "ProductController.allBooks"
  );
  Route.get(
    "/product/category/:id/:page/:show",
    "ProductController.categoryBooks"
  );
  Route.get("/product/book/:id", "ProductController.getSingleBook");
  Route.get(
    "/product/range/:page/:show/:lowPrice/:highestPrice/:type?/:type_id?",
    "ProductController.price_range"
  );
  // Route.get('/product/range/:type?/:type_id?/:page/:show/:lowPrice/:highestPrice', 'ProductController.price_range')
  Route.get(
    "/product/short-by/:page/:show/:query",
    "ProductController.shortBy"
  );
  Route.get("/all-subscriber", "SubscriberController.index");
  Route.post("/subscribe", "SubscriberController.store").validator(
    "Subscriber"
  );
  Route.get(
    "/delivery-method",
    "DeliveryMethodController.getAllDeliveryMethod"
  );
  Route.get("/price-max-min", "ProductController.getMaxAndMinPrice");

  Route.get("/filter/stage/category/:id", "StageController.getStages");
  Route.get("/filter/stage/:id/:page/:show", "StageController.getBooks");
  Route.get("/filter/:page/:show/:search", "ProductController.filtering");

  Route.get("/filter/disciplines", "DisciplineController.getDisciplineList");
  Route.get(
    "/filter/discipline/:id/:page/:show",
    "DisciplineController.getBooks"
  );

  Route.get("/filter/authors", "AuthorController.getAuthorList");
  Route.get("/filter/author/:id/:page/:show", "AuthorController.getBooks");

  Route.get("/filter/publishers", "PublisherController.getPublisherList");
  Route.get(
    "/filter/publisher/:id/:page/:show",
    "PublisherController.getBooks"
  );

  Route.get(
    "/filter/publishing-years",
    "PublishingYearController.getPublishingYearList"
  );
  Route.get(
    "/filter/publishing-year/:id/:page/:show",
    "PublishingYearController.getBooks"
  );

  Route.get("/filter/languages", "LanguageController.getLanguageList");
  Route.get("/filter/language/:id/:page/:show", "LanguageController.getBooks");

  Route.get("/filter/book-covers", "BookCoverController.getBookCoversList");
  Route.get(
    "/filter/book-covers/:id/:page/:show",
    "BookCoverController.getBooks"
  );

  Route.get("/filter-with-category", "FilterController.filterWithCategory");

  Route.get("/mail-send", "MailController.sendMail");
  Route.post("/oauth/", "AuthController.oAuthLogin");

  Route.get("/subscriptions/:email", "SubscriberController.getSubscriptions");
  Route.post("/subscriptions", "SubscriberController.updateSubscriber");

  Route.post("/mpesa/success", "OrderController.mpesaSuccess");
}).prefix("/api");

Route.group(() => {
  Route.get("/user/info", "UserController.getUser");
  Route.post("/user/info", "UserController.update");
  Route.post("/user/payment", "PaymentController.store");
  Route.post("/update-payment-method", "PaymentController.update");
  Route.post("/user/payment/:id", "PaymentController.delete");
  Route.get("/user/favorite", "FavoriteController.getFavoriteItems");
  Route.post("/user/favorite", "FavoriteController.addToFavorite");
  Route.post(
    "/user/favorite/:id/delete",
    "FavoriteController.removeFromFavorite"
  );
  Route.post("/book/review", "ReviewController.create");
  Route.post("/order", "OrderController.store");
  Route.post("/get_pay_iframe", "OrderController.getPaymentIframe");
  Route.post("/swype_success", "OrderController.succesPayment");

  Route.post("/auth/logout", "AuthController.logout");

  Route.get("/promo-code/info/:code", "PromoCodeController.getPromoInfo");
})
  .prefix("/api")
  .middleware(["auth:jwt"]);

Route.post("/pay", "PaymentController.pay");
Route.get("/pay", "PaymentController.payCreate");
Route.get("/success", "PaymentController.paySuccess");
Route.get("/cancel", "PaymentController.payCancel");

Route.group(() => {
  Route.get(
    "/discount-products",
    "DifferentProductController.topDiscountProducts"
  );
  Route.get(
    "/discount-products-limit",
    "DifferentProductController.topDiscountProductsWithLimit"
  );

  Route.get("/sale-products", "DifferentProductController.topSaleProducts");
  Route.get(
    "/sale-products-limit",
    "DifferentProductController.topSaleProductsWithLimit"
  );

  Route.get(
    "/recent-sale-products",
    "DifferentProductController.topRecentSaleProducts"
  );
  Route.get(
    "/recent-sale-products-limit",
    "DifferentProductController.topRecentSaleProductsWithLimit"
  );
}).prefix("api/top");
