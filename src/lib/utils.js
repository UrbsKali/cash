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
            .select('username,avatar_url,role, member_of(project(id, name))')
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
        user.projectId = [...data.member_of.map(p => p.project.id)];
        user.projectName = [...data.member_of.map(p => p.project.name)];
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

export function loadSettings(key) {
    let settings_;
    try {
        settings_ = JSON.parse(window.localStorage.getItem(`settings_${key}`)) || [];
    } catch (e) {
        console.error("echec lors de la récupération des données, la fonction est problement executé depuis le serveur")
        return;
    }
    return settings_
}

export function saveSettings(key, settings) {
    try {
        localStorage.setItem(`settings_${key}`, JSON.stringify(settings));
    } catch (e) {
        console.error("echec lors de l'enregistrement, la fonction est problement executé depuis le serveur")
        return;
    }
}

export function hashCode(obj) {
    let str = JSON.stringify(obj);
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export function hideOnClickOutside(element, destroyHandler = (el) => {
    el.classList.toggle("hidden")
}) {
    const outsideClickListener = event => {
        if (!element.contains(event.target) && isVisible(element)) { // or use: event.target.closest(selector) === null
            destroyHandler(element);
            removeClickListener();
        }
    }

    const removeClickListener = () => {
        document.removeEventListener('click', outsideClickListener);
    }

    document.addEventListener('click', outsideClickListener);
}
const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length); // source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js 
