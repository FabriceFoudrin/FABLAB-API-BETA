const pool = require("../db");


module.exports = function(app)
{
    /**
     * @openapi
     * '/classes':
     *  get:
     *     tags:
     *     - Classes
     *     summary: Récuperer toutes les classes
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
     app.get("/classes", async (reqs, res) => {
        try {
            const allClasses = await pool.query("SELECT * FROM classes");
            res.json(allClasses.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

    /**
     * @openapi
     * '/classe/{id}':
     *  get:
     *     tags:
     *     - Classes
     *     summary: Récupere une classe
     *     parameters:
     *      - name: id
     *        in: path
     *        description: ID unique de la classe
     *        required: true
     *     responses:
     *      200:
     *        description: JSON result
     *      400:
     *        description: Mauvaise reqûete
     *      404:
     *        description: Not Found
     */

    app.get("/classe/:id", async (req, res) => {
        const { id } = req.params;
        try {
            const oneClasse = await pool.query("SELECT * FROM classes WHERE id_classe = $1", [id]);
            res.json(oneClasse.rows);
        } catch (err) {
            console.error(err.message);
        }
    })

  /**
     * @openapi
     * '/classe':
     *  post:
     *     tags:
     *     - Classes
     *     summary: Création d'une classe
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
     *                default: Nouvelle classe
     *     responses:
     *      201:
     *        description: Classe crée
     *      409:
     *        description: En conflit
     *      404:
     *        description: Not Found
     */
    app.post("/classe", async (req, res) => {
        try {
            //await
            const { classe_intitule } = req.body; // SET INTITULE CLASSE


            const newClasse = await pool.query("INSERT INTO classes (intitule) VALUES ($1) RETURNING id_classe", [classe_intitule]);        
            res.json(newClasse);

        } catch (err) {
            console.error(err.message);
        }
    });

    /**
     * @openapi
     * '/classe':
     *  put:
     *     tags:
     *     - Classes
     *     summary: Modification d'une classe
     *     parameters:
     *      - name: id
     *        in: path
     *        description: ID unique de la classe
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
     *                default: CSI
     *     responses:
     *      200:
     *        description: Modifié
     *      400:
     *        description: Mauvaise reqûete
     *      404:
     *        description: Not Found
     */
    app.put("/classe/:id", async (req, res) => {
        try {
            const { id } = req.params; //WHERE
            const { classe_intitule } = req.body; // SET INTITULE
            const updateClasse = await pool.query("UPDATE classes SET intitule = $1 WHERE id_classe = $", [classe_intitule,id]);
            res.json("Classe modifier");
        } catch (err) {
            console.error(err.message);
        }


    });


    /**
     * @openapi
     * '/classe/{id}':
     *  delete:
     *     tags:
     *     - Classes
     *     summary: Supprime une classe
     *     parameters:
     *      - name: id
     *        in: path
     *        description: ID unique de la classe
     *        required: true
     *     responses:
     *      200:
     *        description: JSON result
     *      400:
     *        description: Mauvaise reqûete
     *      404:
     *        description: Not Found
     */
    app.delete("/classe/:id", async (req, res) => {
        try {
            const { id } = req.params; //WHERE
            const deleteClasse = await pool.query("DELETE FROM classes where id_classe = $1", [id]);
            res.json("Classe delete");
        } catch (err) {
            console.error(err.message);
        }
    });

}