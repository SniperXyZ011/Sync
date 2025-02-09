import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decode) {
            return res.status(401).json({ message: "Unauthorized" });
        };
        req.id = decode.userId;
        console.log(decode);
        next();
    }catch(err) {
        console.error(err);
    }
}

export default isAuthenticated;