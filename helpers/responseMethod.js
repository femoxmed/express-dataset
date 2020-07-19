 const responseMethod = (res, status , message) => {
    res.status(status).json({
        status,
        message 
      });
}

module.exports  = {responseMethod};