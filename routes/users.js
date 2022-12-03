
const pool = require("../db");
const bcrypt = require('bcrypt');

module.exports = function(app)
{

     /**
     * @openapi
     * '/users':
     *  get:
     *     tags:
     *     - Utilisateurs
     *     summary: Récuperer tout les utilisateurs
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *          application/json:
     *            schema:
     *              type: json
     *              items:
     *                type: object
     *       400:
     *         description: Mauvaise requête
     */
    app.get("/users", async (reqs, res) => {
        try {
            const allUsers = await pool.query("SELECT * FROM users");
            res.json(allUsers.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

    /**
     * @openapi
     * '/user/{id}':
     *  get:
     *     tags:
     *     - Utilisateurs
     *     summary: Récupere un utilisateur
     *     parameters:
     *      - name: id
     *        in: path
     *        description: ID unique de l'utilisateur
     *        required: true
     *     responses:
     *      200:
     *        description: JSON result
     *      400:
     *        description: Mauvaise reqûete
     *      404:
     *        description: Not Found
     */
    app.get("/user/:id", async (req, res) => {
        const { id } = req.params;
        try {
            const user = await pool.query("SELECT id_user,email,nom,prenom,intitule FROM users u INNER JOIN classes c ON c.id_classe = u.id_classe WHERE id_user = $1", [id]);
            res.json(user.rows[0]);
        } catch (err) {
            console.error(err.message);
        }
    });




    /**
     * @openapi
     * '/user':
     *  post:
     *     tags:
     *     - Utilisateurs
     *     summary: Création d'un utilisateur
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - email
     *              - nom
     *              - prenom
     *              - password
     *              - id_classe
     *            properties:
     *              id:
     *              name:
     *                type: string
     *                default: Nouveau utilisateur
     *     responses:
     *      201:
     *        description: Utilisateur crée
     *      409:
     *        description: En conflit
     *      404:
     *        description: Not Found
     */
    app.post("/user", async (req, res) => {
        try {
            //await
            const { email } = req.body;
            const { nom } = req.body; // SET NOM
            const { prenom } = req.body; // SET PRENOM
            const { password } = req.body; // SET PASSWORD
            const { id_classe } = req.body; // SET CLASSE

            const userExist = await pool.query("SELECT COUNT(*) FROM users WHERE email = $1", [email]);
            console.log();
            if(userExist.rows[0].count > 0){
                res.json(false);
            }else{
                encryptedPassword = await bcrypt.hash(password, 10);

                const newUser = await pool.query("INSERT INTO users (email,nom,prenom,password,id_classe) VALUES ($1,$2,$3,$4,$5) RETURNING *", [email,nom,prenom,encryptedPassword,id_classe]);
                console.log(newUser);
                res.json(newUser);
            }                        
        } catch (err) {
            console.error(err.message);
        }
    });
    /**
     * @openapi
     * '/user/:id':
     *  put:
     *     tags:
     *     - Utilisateurs
     *     summary: Modification de l'utilisateur
     *     parameters:
     *      - name: id
     *        in: path
     *        description: ID unique de l'utilisateur
     *        required: true
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - id
     *              - name
     *            properties:
     *              id:
     *                type: number
     *                default: 1
     *     responses:
     *      200:
     *        description: Modifié
     *      400:
     *        description: Mauvaise reqûete
     *      404:
     *        description: Not Found
     */
    app.put("/user/:id", async (req, res) => {
        try {
            const { id } = req.params; //WHERE
            const { email } = req.body; // SET EMAIL
            const { nom } = req.body; // SET NOM
            const { prenom } = req.body; // SET PRENOM
            const { password } = req.body; // SET PASSWORD
            const { id_classe } = req.body; // SET PASSWORD

            encryptedPassword = await bcrypt.hash(password, 10);

            const updateUser = await pool.query("UPDATE users SET email = $1, nom = $2, prenom = $3, password = $4, id_classe = $5 where id_user = $6", [email, nom, prenom, encryptedPassword, id_classe, id]);
            res.json("Users Updated");
        } catch (err) {
            console.error(err.message);
        }

    });

     /**
     * @openapi
     * '/user/{id}':
     *  delete:
     *     tags:
     *     - Utilisateurs
     *     summary: Supprime un utilisateur
     *     parameters:
     *      - name: id
     *        in: path
     *        description: ID unique d'un utilisateur
     *        required: true
     *     responses:
     *      200:
     *        description: JSON result
     *      400:
     *        description: Mauvaise reqûete
     *      404:
     *        description: Not Found
     */
    app.delete("/user/:id", async (req, res) => {
        try {
            const { id } = req.params; //WHERE
            const deleteUser = await pool.query("DELETE FROM users where id_user = $1", [id]);
            res.json("Users delete");
        } catch (err) {
            console.error(err.message);
        }
    });

/**
     * @openapi
     * '/login':
     *  post:
     *     tags:
     *     - Utilisateurs
     *     summary: Test de connexion au compte
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - email      
     *              - password
     *            properties:
     *              id:
     *              name:
     *                type: string
     *                default: Login
     *     responses:
     *      201:
     *        description: true
     *      409:
     *        description: false
     *      404:
     *        description: Not Found
     */

    app.post("/login", async (req, res) => {
        try {
            //await
            const { email } = req.body;
            const { password } = req.body; // SET PASSWORD
            const verifUserExist = await pool.query("SELECT COUNT(*) FROM users WHERE email = $1", [email]);
            
            if(verifUserExist.rows[0].count > 0){
                const verifUserPassword = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
                const validPassword = await bcrypt.compare(password, verifUserPassword.rows[0].password);
                if (validPassword){
                    res.json(verifUserPassword.rows[0].id_user);
                }else{
                    res.json(false);
                }
                console.log(verifUserPassword);
                
            } else{
                res.json(false);   
            }
            
        } catch (err) {
            console.error(err.message);
        }
    });  

    app.post("/updatepass", async (req, res) => {
        try {
            const { oldpass } = req.body;
            const { newpass } = req.body; // SET PASSWORD
            const { id_user } = req.body;
            const verifUserPassword = await pool.query("SELECT * FROM users WHERE id_user = $1", [id_user]);
        
            const validPassword = await bcrypt.compare(oldpass, verifUserPassword.rows[0].password);
            if (validPassword){
                encryptedPassword = await bcrypt.hash(newpass, 10);
                const changePass = await pool.query("UPDATE users SET password = $1 WHERE id_user = $2", [encryptedPassword,id_user]);
                res.json(true);
            }else{
                res.json(false);    
            }
            
        } catch (err) {
            console.error(err.message);
        }
    }); 


}