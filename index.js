const express = require("express");
const { generateRegistrationOptions } = require("@simplewebauthn/server");
const PORT = 3000;
const app = express();

app.use(express.static("./public"));
app.use(express.json());

const userStore = {};
const challengeStore = {};
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    const id = `user_${Date.now()}`;
    const user = {
        id,
        username,
        password,
    };
    userStore[id] = user;
    console.log(`registered successfully`, userStore[id]);
    return res.json({ id });
});

app.post("/register-challenge", async (req, res) => {
    const { userId } = req.body;
    if (!userStore[userId])
        return res.status(404).json({ error: "user not found!" });
    const user = userStore[userId];
    const challengePayload = await generateRegistrationOptions({
        rpId: "localhost",
        rpName: "My LocalHost Machine",
        username: user.username,
    });
    challengeStore[userId] = challengePayload.challenge;

    return res.json({ options: challengePayload });
});
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
