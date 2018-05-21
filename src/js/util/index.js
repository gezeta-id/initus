let uniqueId = (tag) => tag + Math.random().toString(36).slice(2) +'gid';

module.exports = {
    uniqueId
};
