require('dotenv/config');

module.exports = {
    configurar() {
        /* Captura da passgem de parâmetros via linha de comando */
        const param = process.argv;
        if(param.length > 2){
          const modo = param[2];
          if(modo === 'production'){
            process.env.NODE_ENV = 'production';
          }
        }
    }
}
