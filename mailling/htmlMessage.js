export const htmlMessage = data => `<div class="inbox-area">
    <div class="container">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="view-mail-list sm-res-mg-t-30">
                    <div class="view-mail-atn">
                        <div class="ongfg-email" style="margin: 1rem; padding: .5rem 1rem; border: 2px #1d1b31; border-radius: 1rem; box-shadow: .9px .2px 2px 2px blue;">
                            <div class="ongfg-username"  style="margin: .5rem 0; font-size: larger; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; "> ${data.contenu} </div>
                            <div class="ongfg-close" style="margin: .5rem 0; font-size: larger; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; margin-top: 5rem;">Merci et ${data.plateforme} vous souhaite les bienvenues !</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
