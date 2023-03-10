var loggedUser;
let users = [];
if(localStorage.getItem("users")==null){
  users=[];
}
else {
  users=JSON.parse(localStorage.getItem("users"));
}
let products=[];
if(localStorage.getItem("products")==null){
  products=[];
}
else {
  products=JSON.parse(localStorage.getItem("products"));
}
let categories=[];
if(localStorage.getItem("categories")==null){
  categories=[];
}
else {
  categories=JSON.parse(localStorage.getItem("categories"));
}
let payment =[];
if(localStorage.getItem('payment')==null){
  payment=[];
}
else{
  payment=JSON.parse(localStorage.getItem("payment"));
}
let shipping=[];
if(localStorage.getItem('shipping')==null){
  shipping=[];
}
else{
  shipping=JSON.parse(localStorage.getItem("shipping"));
}
let orders = [];
var carObj;
var cart=[];
if (getCookie('cart')==null) {
  cart=[];
}
else{
  cart=JSON.parse(getCookie('cart'));
}
class User {
  // Static ID that will increase by one every time that user will be created.
  static id = 0;
  // isLogin attr. to know that the user is logged in or not.
  isLogin = false;
  
  static register(name, username, email, password,type) {
    // increase ID by one
    if(type=='client'){
      loggedUser = new Client();
    }
    else{
      loggedUser=new Admin();
    }
    User.id++;
    // Filling user data
    loggedUser.id = User.id;
    loggedUser.name = name;
    loggedUser.username = username;
    loggedUser.email = email;
    loggedUser.password = password;
    loggedUser.cartObj=new Cart();

    // Validation
    for (let i in users) {
      if (users[i]["email"] == loggedUser.email || users[i]["username"] == loggedUser.username) {
        throw new Error("Can't register!");
      }
    }
    let temp={};
    for (const i in loggedUser) {
        temp.id = loggedUser.id;
        temp.name = loggedUser.name;
        temp.username = loggedUser.username;
        temp.email = loggedUser.email;
        temp.password = loggedUser.password;
        temp.cartObj=loggedUser.cartObj;
    }
    users.push(temp);
    users[users.length-1].type=type;
    localStorage.setItem('users',JSON.stringify(users));
  }

  static login(username, password,type) {
    // Validation
    if(type=="admin"){
      loggedUser=new Admin();
    }
    else{
      loggedUser=new Client();
    }
    for (let i = 0; i < users.length; i++) {
      if (username == users[i].username && password == users[i].password) {
        loggedUser.id = users[i].id;
        loggedUser.name =users[i].name;
        loggedUser.username =users[i].username;
        loggedUser.email =users[i].email;
        loggedUser.password =users[i].password;
        loggedUser.cartObj=users[i].cartObj;
        loggedUser.isLogin=true;
        let temp={};
        for (const i in loggedUser) {
            temp.id = loggedUser.id;
            temp.name = loggedUser.name;
            temp.username = loggedUser.username;
            temp.email = loggedUser.email;
            temp.password = loggedUser.password;
            temp.cartObj=loggedUser.carObj;
        }
        users.push(temp);
        localStorage.setItem("users",JSON.stringify(users));
        setCookie('loggedUser',JSON.stringify(users[i]));
        return "SUCCESS";
      }
    }

    return  "Email or password is not correct";
  }

  static logout() {
    let loggedUser = JSON.parse(getCookie("loggedUser"));
    for (let i = 0; i < users.length; i++) {
      if(users[i].id== loggedUser.id ){
        deleteCookie('loggedUser');
        users[i].isLogin=false;
        localStorage.setItem("users",JSON.stringify(users));
      }
    }
  }
  searchProducts(productName) {
    let serchResult =[];
    for (let i = 0; i < products.length; i++) {
      if(products[i].productName.toUpperCase().includes(productName.toUpperCase())){
        serchResult.push(products[i]);
      }
    }
    return serchResult;
  }
  addToCart(prodId,quantity) {
      // for(let i=0 ;i<this.cartObj.cart.length ;i++){
      // var cartId = this.cartObj.cart[i]['prodId']
      // if(cartId==prodId){     
      //     return this.cartObj.editCart(prodId,quantity) ;}
  
      // }
  for(let i=0 ;i<products.length ;i++){
    // var objectValue = Object.values(products[i])
      var productId = products[i]['id']
      var prodquantity ;
      var totalPrice=0;
      if(productId==prodId){
          var productName = products[i]['productName']
          var productQuantity= products[i]['productQuantity']
          var piecePrice = products[i]['piecePrice']
          var productCategory = products[i]['productCategory']
          if((productQuantity-quantity)<0 || (quantity>productQuantity)){
              console.log("sorry this qunatity not found")
              return;
          }     
          
          totalPrice += (quantity * piecePrice)
          products[i]['productQuantity']=productQuantity-quantity
          this.cartObj.cart.push({prodId,productName,quantity,piecePrice,totalPrice,productCategory});
          cart.push(this.cartObj.cart[this.cartObj.cart.length-1]);    //to save the last element in cartObj.cart inside cart (array db)        
          let expireDate = new Date();
          expireDate.setFullYear(expireDate.getFullYear()+1);
          setCookie('cart',JSON.stringify(cart),expireDate);
          //cart.push({prodId,productName,quantity,piecePrice,totalPrice,productCategory})
          //cart.push(JSON.parse(cartObj.cart));
      }
  }

  }

viewCart = function() {
  return cart;
}
  deleteFromCart(cartId) { 
    for(let i=0 ;i<cart.length ;i++){        
        var cartdeletedId = cart[i]['prodId']
        if(cartdeletedId == cartId){
            for (let j = 0; j < products.length; j++) {
              if(cartId==products[j].id){
                products[j].productQuantity+=cart[i].quantity;
                this.cartObj.cart.splice(i,1);
                cart.splice(i,1);
                let expireDate = new Date();
               expireDate.setFullYear(expireDate.getFullYear()+1);
               setCookie('cart',JSON.stringify(cart),expireDate);
                return;
              }
            
        }
  }
}
}
  editCart(prodId,newquantity) {
    var prodquantity;
        for(let i=0 ;i<cart.length ;i++){
            var cartupdatedId = cart[i]['prodId']
            if(cartupdatedId == prodId ){
                var cartQuantity= cart[i]['quantity']
                var cartPrice = cart[i]['piecePrice']
                var carttotalPrice = cart[i]['totalPrice'];
                products[i].productQuantity+=cart[i].quantity;
                if((products[i]['productQuantity']-newquantity)<0){
                    console.log("sorry error found")
                 //   prodquantity=productQuantity
                 return;
                }
                prodquantity=products[i]['productQuantity']-newquantity //to get diff to update products
                products[i].productQuantity=prodquantity;
                cartQuantity = newquantity;
               carttotalPrice= cartQuantity * cartPrice;

              //  console.log( `your order is productId ${cartupdatedId} & productName ${cartName} & productQuantity ${cartQuantity} & piecePrice ${cartPrice} & productforall ${carttotalPrice}`);   
                cart[i]['totalPrice'] = carttotalPrice;
               cart[i]['quantity']=cartQuantity;
               let expireDate = new Date();
               expireDate.setFullYear(expireDate.getFullYear()+1);
               setCookie('cart',JSON.stringify(cart),expireDate);
                return;
            }
    }
  }
  deleteAllCart(){
      if(cart.length>0){ 
        for(let i=0 ;i<cart.length ;i++){
            var cartQuantity= cart[i]['quantity'];
          for (let j = 0; j < products.length; j++) {
            if(cart[i].prodId==products[j].id){
              products[j].productQuantity+=cart[i].quantity;
            }
          }
    }
    this.cartObj.cart=[];
    cart=[];
    setCookie('cart',JSON.stringify(cart));
    }
  
  }
  addOrder() {
    Order.orderIDs++;
    var newOrder = new Order(this.cartObj.cart,'Visa','fast',this.id);
    orders.push(newOrder);
    cart=[];
    this.cartObj.cart=[];
    return newOrder;
  }
  cancelOrder(orderId){
    for (let i = 0; i < orders.length; i++) {
      if(orders[i].orderId==orderId){
        if(orders[i].orderStatus=="pending"){
          for(let j=0;j<orders[i].orderItems.length;j++){
            for (let k = 0; k < products.length; k++) {
                if(orders[i].orderItems[j].prodId==products[k].id){
                  products[k].productQuantity+=orders[i].orderItems[j].quantity;
                }
              
            }
          }
          orders.splice(i,1);
          return;
        }
        else{
          console.log("you can't delete this order");
          return ;
        }
      }   
    }
    console.log("invalid order Id");
  }
  
  // checkout() {}
}
class Admin extends User{
  constructor( ){
    super();
  }
  addProduct(productName,productQuantity,piecePrice,productCategory){
    Product.numberOfProducts+=1;
    let founded=0;
    for (let i = 0; i < categories.length; i++) {
        if(productCategory==categories[i].categoryName){
          founded = 1;
        }      
    }
    if(founded){
      let product = new Product(productName,productQuantity,piecePrice,productCategory);
      products.push(product);
      localStorage.setItem("products",JSON.stringify(products));
    }
    else{
      console.log("invalid category Name");
    }
  };
  updateProduct(id,productName,productQuantity,piecePrice,productCategory){
    let founded = 0;
    for (let i = 0; i < categories.length; i++) {
      if(productCategory==categories[i].categoryName) {
        founded =1;
      }     
    }
    if(founded){
      for (let i = 0; i < products.length; i++) {
        if(products[i].id==id){
          products[i].productName=productName;
          products[i].productQuantity=productCategory;
          products[i].productCategory=productQuantity;
          products[i].piecePrice=piecePrice;
          localStorage.setItem("products",JSON.stringify(products));
        }      
      }
    }
    else{
      console.log("invlaid Category Name");
    }
  }
  deleteProduct(id){
    for (let i = 0; i < products.length; i++) {
      if(products[i].id==id){
        products.splice(i,1);
        localStorage.setItem("products",JSON.stringify(products));
        return;
      }      
  }
  }
  addCategory(categoryName){
    let founded = 0
    for (let i = 0; i < categories.length; i++) {
      if(categoryName==categories[i].categoryName){
        founded=1;
      }
    }
    if(founded==0){
      Category.numberOfCategories+=1;
      let category = new Category(categoryName);
      categories.push(category);
      localStorage.setItem('categories',JSON.stringify(categories));
    }
    else{
      console.log("category name is added before")
    }

  }
  updateCategory(id,categoryName){
    let founded=0;
    let targetedCategoryIndex;
    for (let i = 0; i < categories.length; i++) {
      if(categoryName==categories[i].categoryName){
        founded = 1;
      }
      if(categories[i].id==id){
        targetedCategoryIndex=i;     
      }
    }
    if(!founded){
      categories[targetedCategoryIndex].categoryName=categoryName;
      localStorage.setItem('categories',JSON.stringify(categories));
    }else[
      console.log("this category Name is inserted before")
    ]

  }
  deleteCategory(id){
    for (let i = 0; i < categories.length; i++) {
      if(categories[i].id==id){
        categories.splice(i,1);
        localStorage.setItem('categories',JSON.stringify(categories));
      }      
    }
  }
  categoryProducts(categoryName){
    let result = [];
    for (let i = 0; i < products.length; i++) {
      if( categoryName==products[i].productCategory){
        result.push(products[i]);
      }      
    }
    return result;
  }
  viewProduct(id){
    let product;
    for (let i = 0; i < products.length; i++) {
      if(products[i].id==id);{
        product=products[i];
        return product;
      }      
    }
  }
  addUser( name, username, email, password , type){
    let founded =0;
    for (let i = 0; i < users.length; i++) {
      if(username==users[i].username||email==users[i].email){
        founded =1;
      }      
    }
    if(founded){
      console.log("use another username or email or id");
      return;
    }
    else{
      let addedUser;
      if(type == 'admin'){
        addedUser = new Admin()
      }
      else{
        addedUser = new Client();
      }
      User.id++;
      // Filling user data
      addedUser.id = Client.id;
      addedUser.name = name;
      addedUser.username = username;
      addedUser.email = email;
      addedUser.password = password;
      addedUser.cartObj=new Cart();
      let temp={};
      for (const i in addedUser) {
        temp.id = addedUser.id;
        temp.name = addedUser.name;
        temp.username = addedUser.lusername;
        temp.email = addedUser.email;
        temp.password = addedUser.password;
        temp.cartObj=addedUser.carObj;
      }
      users.push(temp);
      users[users.length-1].type=type;
      localStorage.setItem("users",JSON.stringify(users));
    }
  }
  deleteUser(id){
    for (let i = 0; i < users.length; i++) {
      if(users[i].id==id){
        users.splice(i,1);
        localStorage.setItem("users",JSON.stringify(users));
        console.log("userDeleteSuccessfully");
        return;
      }      
    }
    console.log("invalid user id");
  }
  addPayment(paymentMethod){
    let paymentObj=new Payment(paymentMethod);
    payment.push(paymentObj);
    localStorage.setItem("payment",JSON.stringify(payment));
  }
  deletePayment(paymentId){
    for (let i = 0; i < payment.length; i++) {
      if(payment[i].paymentId==paymentId){
        payment.splice(i,1);
        localStorage.setItem('payment',JSON.stringify(payment));
        return;
      }      
    }
    console.log("invalid ID");
  }
  viewPaymentMethods(){
    return payment;
  }
  addShipping(type,cost){
    let shippingObj = new Shipping(type,cost);
    shipping.push(shippingObj);
    localStorage.setItem("shipping",JSON.stringify(shipping));
  }
  deleteshipping(shippingId){
    for (let i = 0; i < shipping.length; i++) {
      if(shipping[i].shippingId==shippingId){
        shipping.splice(i,1);
        localStorage.setItem('shipping',JSON.stringify(shipping));
        return;
      }      
    }
    console.log("invalid ID");
  }
}
class Client extends User{
  constructor(){
    super();
  }
}
class Category{
  static numberOfCategories;
  constructor(categoryName){
    this.id=Category.numberOfCategories;
    this.categoryName=categoryName;
  }
  viewCategory(){
    return this
  }
  static viewAllCategories(){
    return categories;
  }
}
class Product{
  static numberOfProducts;
  constructor(productName,productQuantity,piecePrice,productCategory){
      this.id=Product.numberOfProducts;
      this.productName=productName;
      this.productQuantity=productQuantity;
      this.piecePrice=piecePrice;
      this.productCategory=productCategory;
  }
  viewProduct(){
      return this
  }
  static viewAllProducts(){
    return products;
  }
}


class Cart {
    constructor(){
      this.cart=[];
    }
    /*********addyoCart***************/
}
/***************order ********/
class Order {
    static orderIDs;
    constructor(orderItems,paymentOption,shippingtype,userId){
     this.orderItems=orderItems
     this.orderId=Order.orderIDs,
     this.orderStatus = "pending",
     this.userId=userId;
     this.createdAt = new Date(),
     this.shippingDate ;
     this.paymentOption = paymentOption,
     this.shippingtype = shippingtype,
     this.totalPrice=0,
     this.index=0;

     /****check on paymentOption */

     for(let i=0 ;i<paymentData.length ;i++){
          var paymentmethod = paymentData[i]['method']
          if(paymentmethod==this.paymentOption){
            var paymentId = paymentData[i]['paymentId']
            console.log( `your paymentmethod ${paymentmethod} & paymentId ${paymentId}`);    
           
          }
        }

        /****check on paymentOption */
        for(let i=0 ;i<cart.length ;i++){
          var carttotalPrice = cart[i]['totalPrice']
          this.totalPrice +=carttotalPrice;
  }
     for(let i=0 ;i<shippingData.length ;i++){
        var shippingtype = shippingData[i]['type']
        if(shippingtype==this.shippingtype){
            this.index=i;
          var shippingId = shippingData[i]['shippingId']
          var shippingcost = shippingData[i]['cost'];
          this.totalPrice +=shippingcost;
          console.log( `your shippingId ${shippingId} & shippingtype ${paymentmethod} & shippingcost ${shippingcost}`);    
        }}
    
    }    
    /*********orderDetails************/
     orderDetails=function(){
         return this 
     }

 }


Product.numberOfProducts=0;
Category.numberOfCategories=0;

//  let n=new Admin();
//  let ziad = new User();

// let ahmed = new Client(2, "ahmed", "ahmedeleraky", "zadeleraky@gmail.com", 12345);
//ziad.register(1, "ziad", "ziadeleraky", "ziadeleraky@gmail.com", 12345);
//n.register(1, "mm", "mm", "mm", 'mm')
// console.log(users);

// n.addCategory("shirts")
// n.addCategory("jackets")
// n.addProduct("shirt1",15,200,"shirts");
// n.addProduct("jacket1",20,1000,"jackets");

Order.orderIDs=0;

//  var cart1= new Cart();
//  cart1.addtoCart(1,3)
//  cart1.addtoCart(2,5)
//  cart1.viewCart();
var order1 = new Order(1,"hold","10-12-2022","15-12-2022","Visa","fast")
console.log(order1.orderDetails())
