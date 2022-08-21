// const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul","Ago","Set","Out","Nov","Dez"]
const meses = ['January','February','March','April','May','June','July','August','September','October','November','December'];
module.exports = {
    formatMesDiaAno(data){
        return  `${meses[(data.getMonth())]} ${data.getDate()}, ${data.getFullYear()}`;
    }
}