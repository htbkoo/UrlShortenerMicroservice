/**
 * Created by Hey on 13 Jun 2017
 */
require('dotenv').config();

module.exports = {
    tryShortening: function(){
        return {
            "error": "'some invalid url' is not a valid url that follow the format 'http://www.example.com'"
        }
    }
};