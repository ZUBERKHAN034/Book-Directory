///////////////// [ RANDOM ID GENERATOR ] /////////////////
function generateId(length) {

    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    let unique_id = '';
    for (let i = 0; i < length; i++) {
        unique_id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return unique_id;
}

module.exports = { generateId }