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
            .select('username,avatar_url,project')
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
        userdata.set(user);
    }
}