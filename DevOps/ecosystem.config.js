module.exports = {
  apps : [
	 	 {
			 name: "ecommerce",
			 script:"/home/ubuntu/www/abookstore_backend/server.js",
			 watch: true,
			 env: {
			 	"NODE_ENV": "production"
			 }
		  
 		 }
 	 ]
};
