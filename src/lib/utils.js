import { userdata } from '$lib/store';
import { supabase } from '$lib/supabaseClient';

export async function loadUserdata() {
    let user = {};
    const {
        data: { session },
        error
    } = await supabase.auth.getSession();
    if (error) {
        console.error(error);
        return;
    }
    if (session) {
        // fetch user data
        const { data, error } = await supabase
            .from('profiles')
            .select('username,avatar_url,project,role')
            .eq('id', session.user.id)
            .single();
        if (error) {
            console.error(error);
            return;
        }
        user.email = session.user.email || user.email;
        user.name = data.username || user.email.split('@')[0];
        user.avatar = data.avatar_url || user.avatar;
        user.id = session.user.id;
        user.projectId = data.project || user.project;
        user.role = data.role || user.role;
        userdata.set(user);
    }
}

export const statusText = {
    pendingCDP: 'En attente de validation par le chef de projet',
    pendingTreso: 'En attente de validation par le trésorier',
    approvedCDP: 'Validé par le chef de projet',
    approvedTreso: 'Validé par le trésorier',
    refusedCDP: 'Refusé par le chef de projet',
    refusedTreso: 'Refusé par le trésorier',
    processingOrder: 'Commande en cours de traitement',
    ordered: 'Commande passée',
    received: 'Commande reçue',
    canceled: 'Commande annulée',
    completed: 'Commande complétée'
};