const pool = require("../db");


module.exports = function(app)
{
    /**
     * @openapi
     * '/espace_resa':
     *  get:
     *     tags:
     *     - Espaces lié à une réservation
     *     summary: Récupere toute les réservertions (confondues)
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
    app.get("/espace_resa", async (reqs, res) => {
        try {
            const allEspacesResa = await pool.query("SELECT * FROM espace_resa");
            res.json(allEspacesResa.rows);
        } catch (err) {
            console.error(err.message);
        }
    });


    /**
     * @openapi
     * '/espace_resa/{id}':
     *  get:
     *     tags:
     *     - Espaces lié à une réservation
     *     summary: Récupere les espaces liés à une réservation
     *     parameters:
     *      - name: id
     *        in: path
     *        description: ID unique d'une réservation
     *        required: true
     *     responses:
     *      200:
     *        description: JSON result
     *      400:
     *        description: Mauvaise reqûete
     *      404:
     *        description: Not Found
     */
    app.get("/espace_resa/:id", async (req, res) => {
        const { id } = req.params;
        try {
            const allEspace = await pool.query("SELECT * FROM espace_resa WHERE id_reservation = $1", [id]);
            res.json(allEspace.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

     /**
     * @openapi
     * '/espace_resa/{id}':
     *  delete:
     *     tags:
     *     - Espaces lié à une réservation
     *     summary: Supprime un espace lié à la résa
     *     parameters:
     *      - name: id
     *        in: path
     *        description: ID unique d'une réservation
     *        required: true
     *     responses:
     *      200:
     *        description: JSON result
     *      400:
     *        description: Mauvaise reqûete
     *      404:
     *        description: Not Found
     */
    app.delete("/espace_resa/:id_espace&:id_reservation", async (req, res) => {
        try {
            const { id_espace } = req.params; // 
            const { id_reservation } = req.params; // 
            const deleteResa = await pool.query("DELETE FROM espace_resa where id_reservation = $1 AND id_espace = $2", [id_reservation,id_espace]);
            res.json("Espaces for resa delete");
        } catch (err) {
            console.error(err.message);
        }
    });

}