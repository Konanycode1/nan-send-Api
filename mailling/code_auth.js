const code_auth = data => 
` <div class="inbox-area">
    <div class="container">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="view-mail-list sm-res-mg-t-30">
                    <div class="view-mail-atn">
                        <div class="ongfg-email" style="margin: 1rem; padding: .5rem 1rem; border: 3px solid rgb(0, 255, 0); border-radius: 1rem; box-shadow: .9px .2px 2px 2px blue;">
                            <h3 class="ongfg-h3" style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: normal; ">Bonjour Madame/Monsieur <span class="ongfg-user" style="font-weight: bolder;"> ${" "+data.fullname},</span></h3>
                            <div class="ongfg-div1" style="margin: .5rem 0; font-size: larger; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">Votre inscription au sien du ${data.plateforme} est bien réçue et est en cours de traitement. Veuillez confirmer le code de vérification la phase finale.</div>
                            <div class="ongfg-username"  style="margin: .5rem 0; font-size: larger; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; "><span class="username" style="font-family: 'Courier New', Courier, monospace;">CODE : </span> <span class="username-content" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: bolder; color: blue;"> ${data.code}</span></div>
                            <div class="ongfg-close" style="margin: .5rem 0; font-size: larger; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-weight: bolder; margin-top: 5rem;">Merci et ${data.plateforme} vous souhaite les bienvenues !</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;

export default code_auth;