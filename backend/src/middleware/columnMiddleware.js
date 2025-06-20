const columnMiddleware = (res, req, next) => {
    if (!req.body.title) {
        return res
            .status(400)
            .json({message: "Title is missing"});
    }
    next();
};
export default columnMiddleware;