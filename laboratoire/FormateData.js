const FormateData = async (Data, Model, requete, Collection) => {
    // const Collection = [];
    await Data.map(async item => {
        const infos = {};
        for (const key in item) {
          if (Object.hasOwnProperty.call(item, key)) {
            const conversKey = key.toLocaleLowerCase().replaceAll(' ', '');
            if (conversKey === 'fullname' || conversKey === 'name' || conversKey === 'username' || conversKey === 'nomprenom' || conversKey === 'nometprenom' || conversKey === 'nom&prenom') {
              infos.fullname = item[key];
            } else if (conversKey === 'phone' || conversKey === 'mobilephone' || conversKey === 'telephone' || conversKey === 'téléphone' || conversKey === 'phoneaddress' || conversKey === 'adressetéléphonique' || conversKey === 'adressetelephonique') {
              infos.sms = item[key][0] !== '+' ? `+${item[key]}` : item[key];
            } else if (conversKey === 'email' || conversKey === 'e-email' || conversKey === 'adressee-mail' || conversKey === 'adressemail' || conversKey === 'email' || conversKey === 'emailaddress' || conversKey === 'e-mailaddress' || conversKey === 'mailaddress') {
              infos.email = item[key];
            } else if (conversKey === 'whatsapp' || conversKey === 'adressewhatsapp' || conversKey === 'whatsappadress') {
              infos.whatsapp = item[key][0] !== '+' ? `+${item[key]}` : item[key];
            }
          }
        }
        for (const keys in infos) {
          if (!infos[keys]) delete infos[keys];
        }
        if (infos.fullname && infos.email && (infos.sms || infos.whatsapp)) {
          infos.entreprise = requete.body.entreprise;
          if (requete.body.user) infos.user = requete.body.user;
          if (requete.body.agent) infos.agent = requete.body.agent;
          const { entreprise, email, fullname } = infos;
          let newContat = undefined;
          const verifyContact = await Model.findOne({ fullname, entreprise, email });
          if (!verifyContact) {
            newContat = await Model.create(infos);
            Collection.push(newContat);
          }
        }
    });

    // return Collection;
}

export default FormateData;