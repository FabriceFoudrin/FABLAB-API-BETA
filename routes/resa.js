
const pool = require("../db");

module.exports = function(app)
{
    function entierAleatoire(min, max)
    {
     return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * @openapi
     * '/resa':
     *  get:
     *     tags:
     *     - Réservation
     *     summary: Récuperer toutes les réservation
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
    app.get("/resa", async (reqs, res) => {
        try {
            const allResas = await pool.query("SELECT * FROM reservation");
            res.json(allResas.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

    /**
     * @openapi
     * '/resa/{id}':
     *  get:
     *     tags:
     *     - Réservation
     *     summary: Récupere une réservation
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
    app.get("/resa/:id", async (req, res) => {
        const { id } = req.params;
        try {
            const allResa = await pool.query("SELECT * FROM reservation WHERE id_reservation = $1", [id]);
            res.json(allResa.rows[0]);
        } catch (err) {
            console.error(err.message);
        }
    });

    app.get("/user_resa/:id&:orderType", async (req, res) => {
        const { id } = req.params;
        const { orderType } = req.params;
        const orderBy = {o1: "date_debut_resa DESC", o2: "date_debut_resa"}
        try {
            const allResa = await pool.query("SELECT id_reservation, date_debut_resa, date_fin_resa, pin FROM reservation WHERE id_user = $1 ORDER BY " + orderBy[orderType], [id]);

            res.json(allResa.rows);
        } catch (err) {
            console.error(err.message);
        }
    });

    /**
     * @openapi
     * '/resa':
     *  post:
     *     tags:
     *     - Réservation
     *     summary: Création d'une réservation
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - date_debut_resa
     *              - date_fin_resa
     *              - qrcode_link
     *              - id_user
     *              - listIdEspace
     *            properties:
     *              id:
     *              name:
     *                type: string
     *                default: Nouvelle réservation
     *     responses:
     *      201:
     *        description: Réservation crée
     *      409:
     *        description: En conflit
     *      404:
     *        description: Not Found
     */
     app.post("/resa", async (req, res) => {
        try {
            //await
            // const { qrcode_link } = req.body; // SET QRCODE LINK
            const { id_user } = req.body; // SET ID_USER
            const { reservations } = req.body; // SET ID_USER
            const { listIdEspace } = req.body; // LIST ID FOR ESPACE RESA

            reservations.forEach(async (reserv)=>{
                const { date_debut_resa } = reserv; // SET DEBUT RESA 
                const { date_fin_resa } = reserv; // SET DATE FIN RESA

                var now = new Date().toISOString();
                const newResa = await pool.query("INSERT INTO reservation (date_resa,date_debut_resa,date_fin_resa,pin,id_user) VALUES ($1,$2,$3,$4,$5) RETURNING id_reservation", [now,date_debut_resa,date_fin_resa,entierAleatoire(10000, 99999),id_user]);        
                
                var id_new_resa = newResa.rows[0].id_reservation;
                listIdEspace.forEach(function(value){
                    const newEspaceForResa = pool.query("INSERT INTO espace_resa (id_espace,id_reservation,date_crea_resa_espace) VALUES ($1,$2,$3) RETURNING *", [value,id_new_resa,now]);
                });    
            })

            res.json({"success": "Résevations effectués avec succès"});

        } catch (err) {
            console.error(err.message);
        }
    });

    /**
     * @openapi
     * '/resapinupdate':
     *  put:
     *     tags:
     *     - Réservation
     *     summary: Modification du PIN de la réservation (aléatoire)
     *     parameters:
     *      - name: id
     *        in: path
     *        description: ID unique de la réservation
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
    app.put("/resapinupdate/:id", async (req, res) => {
        try {
            const { id } = req.params; //WHERE

            const updatePinResa = await pool.query("UPDATE reservation SET pin = $1 WHERE id_reservation = $2", [entierAleatoire(10000, 99999),id]);
            res.json("Pin Résa modifier");
        } catch (err) {
            console.error(err.message);
        }
    });


    /**
     * @openapi
     * '/resa/{id}':
     *  delete:
     *     tags:
     *     - Réservation
     *     summary: Supprime une réservation
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
    app.delete("/resa/:id", async (req, res) => {
        try {
            const { id } = req.params; //WHERE
            const deleteResa = await pool.query("DELETE FROM reservation where id_reservation = $1", [id]);
            res.json("Réservation delete");
        } catch (err) {
            console.error(err.message);
        }
    });

    /**
     * @openapi
     * '/activeresa':
     *  post:
     *     tags:
     *     - Réservation
     *     summary: Vérifie si resa active 
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - id_reservation
     *              - pin
     *            properties:
     *              id:
     *              name:
     *                type: string
     *                default: Check resa
     *     responses:
     *      201:
     *        description: Réservation crée
     *      409:
     *        description: En conflit
     *      404:
     *        description: Not Found
     */
    app.post("/activeresa", async (req, res) => {
        try {
            //await
            const { id_reservation } = req.body; // id resa
            const { pin } = req.body; // pin resa


            const activeResa = await pool.query("SELECT * FROM reservation WHERE id_reservation = $1 and pin = $2", [id_reservation,pin]);
                 
            
            var now = new Date().toISOString();
            console.log("Date actuel : ",now);
            console.log("Date debut resa : ",activeResa.rows[0].date_debut_resa);
            console.log("Date fin resa : ", activeResa.rows[0].date_fin_resa);

            var initialTime = new Date();
            var finalTime = new Date(activeResa.rows[0].date_debut_resa);
            var midTime = new Date(activeResa.rows[0].date_fin_resa);

            console.log({
                days: finalTime.getDay() - initialTime.getDay(),
                hours: finalTime.getHours() - initialTime.getHours(),
                minutes: finalTime.getMinutes() - initialTime.getMinutes(),
                seconds: finalTime.getSeconds() - initialTime.getSeconds(),
                milliseconds: finalTime.getMilliseconds() - initialTime.getMilliseconds(),
            }); // Renvoie le nombre de temps restant avant la resa
            



            let startTimeMilli = finalTime.getTime();
            let endTimeMilli = midTime.getTime();
            let timeToCheckMilli = new Date().getTime();
            
            // change >= to > or <= to < as you need
            if (timeToCheckMilli >= startTimeMilli && timeToCheckMilli <= endTimeMilli) {
                res.json(true);
            }else{res.json(false);}

        } catch (err) {
            console.error(err.message);
        }
    });


    app.post("/test", async (req, res) => {

          var resa = req.body;
          const { listIdEspace } = req.body;
          listIdEspace.forEach(function(value){
            console.log(value);
          });

          res.json(resa);

    });
    

}