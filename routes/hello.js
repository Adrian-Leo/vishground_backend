import { Router } from "express";
import _query from "../db/db.js";
import { authGuard } from "../auth/guard.js";

const router = Router();

router.get("/", authGuard, (req, res) => {
    res.send({
        msg: "Hello"
    })
})

export default router;


