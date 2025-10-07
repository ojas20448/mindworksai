const UserController = require("../controllers/user.controller");

module.exports = (app) => {
    app.post("/api/auth/register", UserController.register);
    app.post("/api/auth/login", UserController.login);
    app.post("/api/auth/logout", UserController.logout);
    app.get("/api/auth/:userId", UserController.getOneUser);
    app.put("/api/auth/update/:userId", UserController.updateUser);
    app.get("/api/users/profile", UserController.getProfile);
}

