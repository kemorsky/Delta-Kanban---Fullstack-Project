const todoMiddleware = (req, res, next) => {
    if (!req.body.title || !req.body.description) {
        return res
            .status(400)
            .json({message: "Title or description is missing"});
    }
    next();
};

export default todoMiddleware;