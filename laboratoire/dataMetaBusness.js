import axios from "axios";

export const SendMessageBusness = async (expediteur, destinataire, content ) => {
    try {
        const apiUrlMetaBusness = 'https://graph.facebook.com/v18.0//messages';
                            
        const accessToken = 'EABpkKkSffjUBOzdtiMZAq7ZC9Jd9W4kUUpChMXnNZC6yji8hewvALNqNPlTsum7aBBeNSpIljViAE2ifM3PANIgL3NlK9vYHS7SJq8is9hcSpcl00vjpf9wDe8PtgmUg1RGZCwl3RM20ZCltavhdIyFsubYMFFpcvQZBsqikmSa7LzLzVZCCLbqeSdbUpk3sN5bGhK1IPIqp2VY2uZBZAaxwZD';
        // const data = {
        //     messaging_product: 'whatsapp',
        //     to: expediteur,
        //     from: destinataire, // Ajoutez cette ligne pour spécifier l'expéditeur
        //     type: 'template',
        //     template: {
        //         name: 'hello_world',
        //         language:{ code: 'en_US' },
        //         // components: [
        //         //     {
        //         //         type: "TEXT",
        //         //         text: content,
        //         //     },
        //         //     {
        //         //         type: "BUTTON",
        //         //         text: "Learn more",
        //         //         payload: "learn_more"
        //         //     }
        //         // ]
        //     }
        // };
        // const headers = {
        //     'Authorization': `Bearer ${accessToken}`,
        //     'Content-Type': 'application/json'
        // };
        // axios.post(apiUrlMetaBusness, data, {headers})
        // .then(response => {
        //     console.log('Réponse de l\'API:', response.data);
        // })
        // .catch(error => {
        //     console.error('Erreur lors de la requête API:', error.response.data || error.message);
        // });

        const url = 'https://graph.facebook.com/761516485842817/feed';
        // const accessToken = 'ACCESS-TOKEN';

        const data = {
        message: 'Hello',
        fields: 'created_time,from,id,message',
        access_token: accessToken,
        };

        axios.post(url, null, { params: data })
        .then(response => {
            console.log('Réponse de l\'API:', response.data);
        })
        .catch(error => {
            console.log('Erreur lors de la requête API:', error.response.data || error.message);
        });
    } catch (error) {
        console.log('Response Status:', error.response.status);
        
    }
}