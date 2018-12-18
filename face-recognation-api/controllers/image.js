const handleImage =(req, res, db) => {
    const {id} = req.body ;
    db('users').where('id', '=', id)
    .increment('entires', 1)
    .returning('entires')
    .then(entires => {
        console.log(entires);
        res.json(entires[0]);
    })
    .catch(err => res.status(400).json('unable to get entires'))
};

module.exports= {
    handleImage: handleImage
};