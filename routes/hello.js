import { Router } from "express";
import _query from "../db/db.js";

const router = Router();

router.get("/", (req, res) => {
    res.send({
        msg: "Hello"
    })
})

export default router;


