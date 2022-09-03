$(document).ready(function () {
    $('.sidenav').sidenav();
});
function montarJson(idForm) {
    const campos = idForm.querySelectorAll('input');
    let strEnvio = '';
    campos.forEach(campo => {
        if (campo.value) {
            strEnvio += `"${campo.name}":"${campo.value}"`;
            strEnvio += ',';
        }
    });
    if (strEnvio.length) {
        strEnvio = strEnvio.substring(0, strEnvio.length - 1);
        strEnvio = '{' + strEnvio + '}';
    }
    return JSON.parse(strEnvio);
}
const form = document.getElementById("fCostumer");
if (form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const retorno = $.post("/nfeCustomer", montarJson(form), "json");
        retorno.done(function () {
            M.toast({ html: 'Cadastro realizado com sucesso!', classes: 'rounded' });
        }).fail(function (erro) {
            $("#alerta").empty().append(erro.responseText);
        });
    });
}
const formNfe = document.getElementById("nfeBackup");
if (formNfe) {
    formNfe.addEventListener('submit', function (event) {
        event.preventDefault();
        const retorno = $.post("/nfeBackup", montarJson(formNfe), "json");
        retorno.done(function () {
            M.toast({ html: 'Cadastro realizado com sucesso!', classes: 'rounded' });
        }).fail(function (erro) {
            $("#alerta").empty().append(erro.responseText);
        });
    });
}