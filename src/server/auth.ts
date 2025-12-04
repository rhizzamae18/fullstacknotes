import express, { Router, type Request, type Response } from "express";
import type { UserInfo } from "remult";

const validUsers: UserInfo[] = [
    { id: "1", name: "Rhizza", roles: ["admin"] },
    { id: "2", name: "Discaya" }
];

export const auth = Router();
auth.use(express.json());

interface AuthRequest extends Request {
    session?: { user: UserInfo | null };
}

auth.post("/api/signIn", (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const user = validUsers.find(user => user.name === req.body.username)
    if (user) {
        if (authReq.session) authReq.session["user"] = user;
        res.json(user)
    } else {
        res.status(404).json("Invalid User")
    }
});

auth.post("/api/signOut", (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    if (authReq.session) authReq.session["user"] = null;
    res.json("ok");
})

auth.get("/api/currentUser", (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    res.json(authReq.session?.["user"]);
})