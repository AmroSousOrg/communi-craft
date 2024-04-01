/**
 * handling not found errors
 */
const notFoundHandler = (req, res, next) => {
    const message = 'Not Found';
    res.status(404).json({ message });
};

module.exports = notFoundHandler;
