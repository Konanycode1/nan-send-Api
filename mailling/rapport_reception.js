const rapport_reception = data => 
    ` <div class="inbox-area">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="view-mail-list sm-res-mg-t-30">
                        <div class="view-mail-atn">
                            <div class="ongfg-email" style="margin: 1rem; padding: .5rem 1rem; border: 3px solid rgb(0, 255, 0); border-radius: 1rem; box-shadow: .9px .2px 2px 2px blue;">
                                <h3 class="ongfg-h3" style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: normal; ">Bonjour Madame/Monsieur <span class="ongfg-user" style="font-weight: bolder;"> ${" "+data.nomBene+" "+data.prenomBene},</span></h3>
                                <div class="ongfg-div1" style="margin: .5rem 0; font-size: larger; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">Vous avez reçu un virement de <strong>${data.montant} FCFA</strong> de <strong>${data.expediteur}</strong>, compte de <strong> Madame/Monsieur ${" "+data.nomExpediteur+" "+data.prenomExpediteur}</strong> à la date du <strong>${data.dateVirement}</strong>. </div>
                                <div class="ongfg-username"  style="margin: .5rem 0; font-size: larger; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; "><span class="username" style="font-family: 'Courier New', Courier, monospace;">REFERENCE DE VIREMENT : </span> <span class="username-content" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: bolder; color: blue;"> ${data.reference}</span></div>
                                <div class="ongfg-div1" style="margin: .5rem 0; font-size: larger; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">Votre solde actuel est de <strong>${data.nouveauSolde} FCFA</strong> </div>
                                <div class="ongfg-div1" style="margin: .5rem 0; font-size: larger; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">${data.plateforme} vous remerci pour votre fidélité et vous souhaite un très bonne suite.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
module.exports = rapport_reception;