const pool = require("../db");


module.exports = function(app)
{
     /**
     * @openapi
     * '/espaces':
     *  get:
     *     tags:
     *     - Espaces
     *     summary: Récuperer tout les classes
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
     app.get("/espaces", async (reqs, res) => {
        try {
            const allEspaces = await pool.query("SELECT * FROM espaces");
            res.json(allEspaces.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

     /**
     * @openapi
     * '/espace/{id}':
     *  get:
     *     tags:
     *     - Espaces
     *     summary: Récupere un espace
     *     parameters:
     *      - name: id
     *        in: path
     *        description: ID unique d'un espace
     *        required: true
     *     responses:
     *      200:
     *        description: JSON result
     *      400:
     *        description: Mauvaise reqûete
     *      404:
     *        description: Not Found
     */
     app.get("/espace/:id", async (req, res) => {
        const { id } = req.params;
        try {
            const allEspace = await pool.query("SELECT * FROM espaces WHERE id_espace = $1", [id]);
            res.json(allEspace.rows[0]);
        } catch (err) {
            console.error(err.message);
        }
    });

     /**
     * @openapi
     * '/espace':
     *  post:
     *     tags:
     *     - Espaces
     *     summary: Création d'un espace
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - name
     *            properties:
     *              id:
     *              name:
     *                type: string
     *                default: Nouvelle espace
     *     responses:
     *      201:
     *        description: Espace crée
     *      409:
     *        description: En conflit
     *      404:
     *        description: Not Found
     */
    app.post("/espace", async (req, res) => {
        try {
            //await
            const { espace_intitule } = req.body; // SET DEBUT RESA 
            const { espace_description } = req.body; // SET DATE FIN RESA


            const newEspace = await pool.query("INSERT INTO espaces (intitule,description) VALUES ($1,$2) RETURNING id_espace", [espace_intitule,espace_description]);        
            res.json(newEspace);

        } catch (err) {
            console.error(err.message);
        }
    });

    

    /**
     * @openapi
     * '/espace':
     *  put:
     *     tags:
     *     - Espaces
     *     summary: Modification d'un espace
     *     parameters:
     *      - name: id
     *        in: path
     *        description: ID unique de l'espace
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
     *              name:
     *                type: string
     *                default: Imprimante 3D
     *     responses:
     *      200:
     *        description: Modifié
     *      400:
     *        description: Mauvaise reqûete
     *      404:
     *        description: Not Found
     */
    app.put("/espace/:id", async (req, res) => {
        try {
            const { id } = req.params; //WHERE
            const { espace_intitule } = req.body; // SET INTITULE
            const { espace_description } = req.body; // SET DESCRIPTION


            const updatePinResa = await pool.query("UPDATE espaces SET intitule = $1, description = $2  WHERE id_espace = $3", [espace_intitule,espace_description,id]);
            res.json("Espace modifier");
        } catch (err) {
            console.error(err.message);
        }


    });


    /**
     * @openapi
     * '/espace/{id}':
     *  delete:
     *     tags:
     *     - Espaces
     *     summary: Supprime un espace
     *     parameters:
     *      - name: id
     *        in: path
     *        description: ID unique d'un espace
     *        required: true
     *     responses:
     *      200:
     *        description: JSON result
     *      400:
     *        description: Mauvaise reqûete
     *      404:
     *        description: Not Found
     */
    app.delete("/espace/:id", async (req, res) => {
        try {
            const { id } = req.params; //WHERE
            const deleteResa = await pool.query("DELETE FROM espaces where id_espace = $1", [id]);
            res.json("Espaces delete");
        } catch (err) {
            console.error(err.message);
        }
    });
}