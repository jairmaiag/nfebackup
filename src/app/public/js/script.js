const form = document.getElementById("fCostumer");
function criarCampoJson(objInput) {
    const jsonString = `"${objInput.name}":"${objInput.value}"`;
    return jsonString;
}
form.addEventListener('submit', function (event) {
    event.preventDefault();
    const campos = form.querySelectorAll('input');
    let strEnvio = '';
    campos.forEach(campo => {
        if (campo.value) {
            strEnvio += criarCampoJson(campo);
            strEnvio += ',';
        }
    });
    if (strEnvio.length) {
        strEnvio = strEnvio.substring(0, strEnvio.length - 1);
        strEnvio = '{' + strEnvio + '}';
    }
    const retorno = $.post("/nfeCustomer", JSON.parse(strEnvio), "json");
    retorno.done(function () {
        M.toast({ html: 'Cadastro realizado com sucesso!', classes: 'rounded' });
    }).fail(function (erro) {
        $("#alerta").empty().append(erro.responseText);
    });
});