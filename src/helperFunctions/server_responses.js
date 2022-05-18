const sendServerErrorResponse = function(errMsg,res) 
                            {
                                     return res.status(500).json({"status":"error", "error": errMsg })
                            }


const sendDbOperationError = function(errMsg)
                                    {
                                            console.log( errMsg + ' \n ')
                                            const err = new Error(errMsg)
                                            return err 
                                    }


module.exports = { sendServerErrorResponse, sendDbOperationError  }